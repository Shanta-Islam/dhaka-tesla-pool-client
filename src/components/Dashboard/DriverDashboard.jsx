import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

import useAxiosSecure from "../../hooks/useAxiosSecure";

const DriverDashboard = ({ user, onLogout }) => {
  const axiosSecure = useAxiosSecure();

  const [view, setView] = useState("vehicles");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // =========================
  // VEHICLE FORM
  // =========================

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // =========================
  // GET MY VEHICLES
  // =========================

  const {
    data: vehicles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myVehicles"],
    queryFn: async () => {
      const response = await axiosSecure.get("/vehicles");

      return response.data.vehicles || [];
    },
  });

  // =========================
  // ADD VEHICLE
  // =========================

  const handleAddVehicle = async (data) => {
    try {
      await axiosSecure.post("/vehicles", {
        vehicleName: data.vehicleName,
        vehicleType: data.vehicleType,
        plateNumber: data.plateNumber,
        capacity: Number(data.capacity),
      });

      await Swal.fire({
        icon: "success",
        title: "Vehicle Added!",
        text: "Your vehicle has been added successfully.",
        confirmButtonColor: "#f97316",
      });

      reset();

      await refetch();

      setView("vehicles");
    } catch (error) {
      console.error("Add vehicle error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text:
          error.response?.data?.message ||
          "Failed to add vehicle.",
        confirmButtonColor: "#f97316",
      });
    }
  };

  // =========================
  // DELETE VEHICLE
  // =========================

  const handleDeleteVehicle = async (vehicleId) => {
    const result = await Swal.fire({
      title: "Delete Vehicle?",
      text: "Are you sure you want to delete this vehicle?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axiosSecure.delete(`/vehicles/${vehicleId}`);

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Vehicle deleted successfully.",
        confirmButtonColor: "#f97316",
      });

      await refetch();

      if (selectedVehicle?.id === vehicleId) {
        setSelectedVehicle(null);
      }
    } catch (error) {
      console.error("Delete vehicle error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error.response?.data?.message ||
          "Failed to delete vehicle.",
        confirmButtonColor: "#f97316",
      });
    }
  };

  // =========================
  // SELECT VEHICLE
  // =========================

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setView("createPool");
  };

  // =========================
  // GET MY POOL
  // =========================
  const {
    data: currentPool,
    isLoading: poolLoading,
    refetch: refetchMyPool,
  } = useQuery({
    queryKey: ["myPool"],
    queryFn: async () => {
      const response = await axiosSecure.get("/pools/my-pool");
      return response.data.pool;
    },
    retry: false,
  });

  // Auto-switch to currentPool view when active pool exists on load
  useEffect(() => {
    if (
      !poolLoading &&
      currentPool &&
      ["OPEN", "FULL", "IN_PROGRESS"].includes(currentPool.status) &&
      view === "vehicles"
    ) {
      setView("currentPool");
    }
  // Only run once after pool data loads
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolLoading, currentPool]);

  const hasActivePool =
    currentPool &&
    ["OPEN", "FULL", "IN_PROGRESS"].includes(currentPool.status);

  // =========================
  // CREATE POOL
  // =========================

  const handleCreatePool = async (event) => {
    event.preventDefault();

    if (!selectedVehicle) {
      Swal.fire({
        icon: "warning",
        title: "Select a Vehicle",
        text: "Please select a vehicle before creating a pool.",
        confirmButtonColor: "#f97316",
      });

      return;
    }

    try {
      await axiosSecure.post("/pools", {
        vehicleId: selectedVehicle.id,
        maxCapacity: selectedVehicle.capacity,
      });

      // Refresh current pool data
      await refetchMyPool();

      await Swal.fire({
        icon: "success",
        title: "Pool Created!",
        text: "Your ride pool is now open for passengers.",
        confirmButtonColor: "#f97316",
      });

      setView("currentPool");
    } catch (error) {
      console.error("Create pool error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text:
          error.response?.data?.message ||
          "Failed to create pool.",
        confirmButtonColor: "#f97316",
      });
    }
  };


  // =========================
  // HANDLE DRIVER ARRIVED
  // =========================

  const handleDriverArrived = async (rideRequestId) => {
    try {
      await axiosSecure.patch("/rides/driver-arrived", {
        rideRequestId,
      });

      await refetchMyPool();

      Swal.fire({
        icon: "success",
        title: "Driver Arrived",
        text: "You have arrived at the passenger pickup location.",
        confirmButtonColor: "#f97316",
      });
    } catch (error) {
      console.error("Driver arrived error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text:
          error.response?.data?.message ||
          "Failed to update ride status.",
        confirmButtonColor: "#f97316",
      });
    }
  };

  // =========================
  // HANDLE START RIDE
  // =========================

  const handleStartRide = async (rideRequestId) => {
    try {
      await axiosSecure.patch("/rides/start", {
        rideRequestId,
      });

      await refetchMyPool();

      Swal.fire({
        icon: "success",
        title: "Ride Started",
        text: "The ride has been started successfully.",
        confirmButtonColor: "#f97316",
      });
    } catch (error) {
      console.error("Start ride error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text:
          error.response?.data?.message ||
          "Failed to start ride.",
        confirmButtonColor: "#f97316",
      });
    }
  };
  // =========================
  // HANDLE COMPLETE RIDE
  // =========================
 const handleCompleteRide = async (rideRequestId) => {
  try {
    const response = await axiosSecure.patch("/rides/complete", {
      rideRequestId,
    });

    await Swal.fire({
      icon: "success",
      title: "Ride Completed",
      text: response.data.message || "Ride completed successfully.",
      confirmButtonColor: "#f97316",
    });

    await refetchMyPool();

    // Pool completed হলে Current Pool থেকে Vehicles page-এ ফিরে যাবে
    if (response.data.pool?.status === "COMPLETED") {
      setView("vehicles");
    }
  } catch (error) {
    console.error("Complete ride error:", error);

    Swal.fire({
      icon: "error",
      title: "Failed!",
      text:
        error.response?.data?.message ||
        "Failed to complete ride.",
      confirmButtonColor: "#f97316",
    });
  }
};

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    onLogout();
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f1e8] text-slate-900">
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center shadow">
                <span className="text-base font-black text-amber-400">
                  P
                </span>
              </div>

              <p className="text-lg font-black text-black tracking-tight">
                PoolDhaka
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-orange-500" />

            <p className="mt-4 text-sm text-stone-500">
              Loading your vehicles...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // VEHICLE ERROR
  // =========================

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f4f1e8] text-slate-900">
        <header className="border-b border-stone-200 ">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center shadow">
                <span className="text-base font-black text-amber-400">
                  P
                </span>
              </div>

              <p className="text-lg font-black text-black tracking-tight">
                PoolDhaka
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
            <h2 className="text-lg font-bold text-red-700">
              Failed to load vehicles
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error?.response?.data?.message ||
                "Something went wrong."}
            </p>

            <button
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1e8] text-slate-900">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="border-b border-stone-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center shadow">
              <span className="text-base font-black text-amber-400">
                P
              </span>
            </div>

            <p className="text-lg font-black text-black tracking-tight">
              PoolDhaka
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={handleLogout}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-50"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* =========================================
          MAIN
      ========================================= */}

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_280px]">

        {/* =========================================
            LEFT CONTENT
        ========================================= */}

        <section>

          {/* =====================================
              VEHICLES VIEW
          ===================================== */}

          {view === "vehicles" && (
            <section>
              {vehicles.length === 0 ? (
                // No vehicle state
                <div className="rounded-3xl border border-stone-200 bg-[#fffcef]  p-10 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                    🚗
                  </div>

                  <h2 className="text-2xl font-bold text-stone-800">
                    No Vehicles Yet
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                    Add your vehicle to start creating ride pools for passengers.
                  </p>

                  <button
                    type="button"
                    onClick={() => setView("addVehicle")}
                    className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    + Add Vehicle
                  </button>
                </div>
              ) : (
                // Vehicle exists
                <>


                  <div className=" bg-[#fffcef] p-6 rounded-3xl border border-stone-200 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-stone-800">
                          My Vehicles
                        </h2>

                        <p className="mt-1 text-sm text-stone-500">
                          Manage your vehicles and create ride pools.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setView("addVehicle")}
                        className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        + Add Vehicle
                      </button>
                    </div>

                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="rounded-3xl border border-stone-200 bg-[#fffcef] p-6"
                      >
                        <h3 className="text-lg font-bold text-stone-800">
                          {vehicle.vehicleName}
                        </h3>

                        <p className="mt-1 text-sm text-stone-500">
                          {vehicle.vehicleType}
                        </p>

                        <div className="mt-4 space-y-2 text-sm text-stone-600">
                          <p>
                            <span className="font-medium">Plate:</span>{" "}
                            {vehicle.plateNumber}
                          </p>

                          <p>
                            <span className="font-medium">Capacity:</span>{" "}
                            {vehicle.capacity} seats
                          </p>
                        </div>

                        <div className="mt-6 flex gap-3">
                          <button
                            type="button"
                            disabled={hasActivePool}
                            onClick={() => handleSelectVehicle(vehicle)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold ${hasActivePool
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-orange-500 text-white hover:bg-orange-600"
                              }`}
                          >
                            {hasActivePool ? "Pool Active" : "Create Pool"}
                          </button>

                          {!hasActivePool && (<button
                            type="button"
                            disabled={hasActivePool}
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                          >
                            Delete
                          </button>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* =====================================
              ADD VEHICLE VIEW
          ===================================== */}

          {view === "addVehicle" && (
            <div>
              <div className="rounded-3xl border border-stone-200 bg-[#fffcef]  p-7 shadow-sm">

                <h2 className="text-2xl font-bold">
                  Add Vehicle
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Add your vehicle before creating a pool.
                </p>

                <form
                  onSubmit={handleSubmit(
                    handleAddVehicle
                  )}
                  className="mt-7 space-y-5"
                >

                  {/* Vehicle Name */}

                  <div>
                    <label className="text-sm font-medium">
                      Vehicle Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter vehicle name"
                      {...register("vehicleName", {
                        required:
                          "Vehicle name is required",
                      })}
                      className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />

                    {errors.vehicleName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.vehicleName.message}
                      </p>
                    )}
                  </div>

                  {/* Vehicle Type */}

                  <div>
                    <label className="text-sm font-medium">
                      Vehicle Type
                    </label>

                    <input
                      type="text"
                      placeholder="Enter vehicle type"
                      {...register("vehicleType", {
                        required:
                          "Vehicle type is required",
                      })}
                      className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 uppercase outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />

                    {errors.vehicleType && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.vehicleType.message}
                      </p>
                    )}
                  </div>

                  {/* Plate Number */}

                  <div>
                    <label className="text-sm font-medium">
                      Plate Number
                    </label>

                    <input
                      type="text"
                      placeholder="Enter plate number"
                      {...register("plateNumber", {
                        required:
                          "Plate number is required",
                      })}
                      className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 uppercase outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />

                    {errors.plateNumber && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.plateNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Capacity */}

                  <div>
                    <label className="text-sm font-medium">
                      Capacity
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="3"
                      placeholder="Maximum 3 seats"
                      {...register("capacity", {
                        required:
                          "Capacity is required",
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message:
                            "Capacity must be at least 1",
                        },
                        max: {
                          value: 3,
                          message:
                            "Capacity cannot exceed 3",
                        },
                      })}
                      className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />

                    <p className="mt-1 text-xs text-stone-400">
                      PoolDhaka currently supports up to 3 seats.
                    </p>

                    {errors.capacity && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.capacity.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                  >
                    Add Vehicle
                  </button>

                </form>
              </div>
            </div>
          )}

          {/* =====================================
              CREATE POOL VIEW
          ===================================== */}

          {view === "createPool" && (
            <div>

              <button
                onClick={() => {
                  setSelectedVehicle(null);
                  setView("vehicles");
                }}
                className="mb-5 text-sm font-medium text-stone-600 transition hover:text-slate-900"
              >
                ← Back to Vehicles
              </button>

              <div className="rounded-3xl border border-stone-200 bg-[#fffcef]  p-7 shadow-sm">

                <h2 className="text-2xl font-bold">
                  Create Pool
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Create a shared ride pool using your vehicle.
                </p>

                {selectedVehicle && (
                  <div className="mt-7 rounded-2xl border border-orange-200 bg-orange-50 p-5">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl">
                        🚗
                      </div>

                      <div>
                        <p className="font-bold text-stone-900">
                          {selectedVehicle.vehicleName}
                        </p>

                        <p className="text-sm text-stone-500">
                          {selectedVehicle.vehicleType} ·{" "}
                          {selectedVehicle.plateNumber}
                        </p>
                      </div>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-white p-4">
                        <p className="text-xs text-stone-400">
                          Vehicle Capacity
                        </p>

                        <p className="mt-1 font-bold">
                          {selectedVehicle.capacity} seats
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-4">
                        <p className="text-xs text-stone-400">
                          Pool Capacity
                        </p>

                        <p className="mt-1 font-bold">
                          {selectedVehicle.capacity} seats
                        </p>
                      </div>

                    </div>

                  </div>
                )}

                <form
                  onSubmit={handleCreatePool}
                  className="mt-6"
                >
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                  >
                    Create Pool
                  </button>
                </form>

              </div>
            </div>
          )}

          {/* =====================================
              CURRENT POOL VIEW
          ===================================== */}
          {view === "currentPool" && (
            <div className="space-y-6">
              {poolLoading ? (
                <div className="rounded-3xl border border-stone-200 bg-[#fffcef] p-8 text-center">
                  <p className="text-stone-500">
                    Loading current pool...
                  </p>
                </div>
              ) : !currentPool ? (
                <div className="rounded-3xl border border-stone-200 bg-[#fffcef] p-10 text-center">
                  <div className="text-5xl">👥</div>

                  <h3 className="mt-4 text-xl font-bold text-stone-800">
                    No Active Pool
                  </h3>

                  <p className="mt-2 text-sm text-stone-500">
                    You don't have an active pool right now.
                  </p>

                  <button
                    type="button"
                    onClick={() => setView("createPool")}
                    className="mt-6 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Create Pool
                  </button>
                </div>
              ) : (
                <div className="space-y-6 rounded-3xl border border-stone-200 bg-[#fffcef] p-6 shadow-sm">

                  {/* Pool Header */}
                  <div>
                    <h2 className="mt-1 text-3xl font-bold text-stone-800">
                      Current Pool
                    </h2>

                    <p className="mt-2 text-stone-500">
                      Manage your active ride pool and passengers.
                    </p>
                  </div>

                  {/* Pool Summary */}
                  <div className="grid gap-4 sm:grid-cols-3">

                    <div className="rounded-3xl border border-stone-200 p-6">
                      <p className="text-sm text-stone-500">
                        Pool Status
                      </p>

                      <p className="mt-2 text-2xl font-bold text-stone-800">
                        {currentPool.status}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-stone-200 p-6">
                      <p className="text-sm text-stone-500">
                        Occupied Seats
                      </p>

                      <p className="mt-2 text-2xl font-bold text-stone-800">
                        {currentPool.occupiedSeats}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-stone-200 p-6">
                      <p className="text-sm text-stone-500">
                        Available Seats
                      </p>

                      <p className="mt-2 text-2xl font-bold text-stone-800">
                        {currentPool.availableSeats}
                      </p>
                    </div>

                  </div>

                  {/* Vehicle */}
                  <div className="rounded-3xl border border-stone-200 p-6">
                    <h3 className="text-lg font-bold text-stone-800">
                      Vehicle
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">

                      <div>
                        <p className="text-xs text-stone-400">
                          Vehicle
                        </p>

                        <p className="mt-1 font-semibold text-stone-700">
                          {currentPool.vehicle?.vehicleName}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-400">
                          Plate Number
                        </p>

                        <p className="mt-1 font-semibold text-stone-700">
                          {currentPool.vehicle?.plateNumber}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Passengers */}
                  <div className="rounded-3xl border border-stone-200 p-6">

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-stone-800">
                          Passengers
                        </h3>

                        <p className="mt-1 text-sm text-stone-500">
                          {currentPool.members?.length || 0} passenger(s) joined
                        </p>
                      </div>
                    </div>

                    {currentPool.members?.length === 0 ? (
                      <div className="mt-6 rounded-2xl p-6 text-center">
                        <p className="text-sm text-stone-500">
                          No passengers have joined your pool yet.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-6 space-y-4">

                        {currentPool.members.map((member) => (

                          <div
                            key={member.id}
                            className="rounded-2xl border border-stone-200 p-4"
                          >

                            {/* Passenger Header */}
                            <div className="flex items-start justify-between gap-4">

                              <div>
                                <h4 className="font-semibold text-stone-800">
                                  {member.passenger?.name}
                                </h4>

                                <p className="mt-1 text-sm text-stone-500">
                                  {member.passenger?.phone || "No phone number"}
                                </p>
                              </div>

                              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                                {member.rideRequest?.status}
                              </span>

                            </div>

                            {/* Ride Information */}
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">

                              <div>
                                <p className="text-xs text-stone-400">
                                  Pickup
                                </p>

                                <p className="mt-1 text-sm text-stone-700">
                                  {member.rideRequest?.pickupAddress}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-stone-400">
                                  Drop-off
                                </p>

                                <p className="mt-1 text-sm text-stone-700">
                                  {member.rideRequest?.dropoffAddress}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-stone-400">
                                  Seats
                                </p>

                                <p className="mt-1 text-sm font-semibold text-stone-700">
                                  {member.rideRequest?.seats}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-stone-400">
                                  Pool Fare
                                </p>

                                <p className="mt-1 text-sm font-semibold text-orange-600">
                                  ৳{member.fareAmount}
                                </p>
                              </div>

                            </div>

                            {/* Driver Arrived Button */}
                            {member.rideRequest?.status === "MATCHED" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDriverArrived(
                                    member.rideRequest.id
                                  )
                                }
                                className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                              >
                                🚗 Driver Arrived
                              </button>
                            )}

                            {/* Driver Arrived Status */}
                            {member.rideRequest?.status === "DRIVER_ARRIVED" && (
                              <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-600">
                                ✓ Driver Arrived
                              </div>
                            )}

                            {member.rideRequest?.status === "DRIVER_ARRIVED" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStartRide(member.rideRequest.id)
                                }
                                className="mt-4 w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                              >
                                ▶ Start Ride
                              </button>
                            )}

                            {member.rideRequest?.status === "STARTED" && (
                              <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-600">
                                🚗 Ride Started
                              </div>
                            )}
                            {member.rideRequest?.status === "STARTED" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCompleteRide(member.rideRequest.id)
                                }
                                className="mt-4 w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                              >
                                ✓ Complete Ride
                              </button>
                            )}

                            {member.rideRequest?.status === "COMPLETED" && (
                              <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-600">
                                ✓ Ride Completed
                              </div>
                            )}

                          </div>

                        ))}

                      </div>
                    )}

                  </div>

                </div>
              )}
            </div>
          )}
        </section>

        {/* =========================================
            RIGHT SIDEBAR
        ========================================= */}

        <aside className="space-y-5">

          {/* DRIVER INFO */}

          <div className="rounded-3xl border border-stone-200 bg-[#fffcef] p-6 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-700">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "D"}
              </div>

              <div className="min-w-0">

                <p className="truncate font-bold">
                  {user?.name || "Driver"}
                </p>

                <p className="truncate text-sm text-stone-500">
                  Driver
                </p>

              </div>

            </div>

            {user?.email && (
              <p className="mt-4 truncate text-xs text-stone-400">
                {user.email}
              </p>
            )}

          </div>

          {/* STATS */}

          <div className="rounded-3xl border border-stone-200 bg-[#fffcef] p-6 shadow-sm">

            <h3 className="font-bold">
              Your Stats
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex justify-between">
                <span className="text-sm text-stone-500">
                  Vehicles
                </span>

                <span className="font-bold">
                  {vehicles.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-stone-500">
                  Pool capacity
                </span>

                <span className="font-bold">
                  {vehicles.length > 0
                    ? vehicles.reduce(
                      (total, vehicle) =>
                        total + vehicle.capacity,
                      0
                    )
                    : 0}
                </span>
              </div>

            </div>

          </div>

          {/* NAVIGATION */}

          <div className="rounded-3xl border border-stone-200 bg-[#fffcef] p-3 shadow-sm">

            {vehicles.length > 0 && (
              <button
                type="button"
                onClick={() => setView("vehicles")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-stone-600 hover:bg-stone-50"
              >
                <span>🚗</span>
                <span>My Vehicles</span>
              </button>
            )}

            <button
              onClick={() => {
                reset();
                setView("addVehicle");
              }}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${view === "addVehicle"
                ? "bg-orange-100 text-orange-600"
                : "hover:bg-stone-50"
                }`}
            >
              ➕ Add Vehicle
            </button>

            <button
              type="button"
              disabled={vehicles.length === 0 || hasActivePool}
              onClick={() => setView("createPool")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                vehicles.length === 0 || hasActivePool
                  ? "cursor-not-allowed text-stone-300"
                  : view === "createPool"
                  ? "bg-orange-100 text-orange-600"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <span>🚘</span>
              <span>Create Pool</span>
              {hasActivePool && (
                <span className="ml-auto text-xs">🔒</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setView("currentPool")}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                view === "currentPool"
                  ? "bg-orange-50 text-orange-600"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>👥</span>
                <span>Current Pool</span>
              </span>
              {hasActivePool && (
                <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />
              )}
            </button>
          </div>

        </aside>

      </main>
    </div>
  );
};

export default DriverDashboard;


