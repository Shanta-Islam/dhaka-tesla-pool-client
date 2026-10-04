// import { useState, useEffect, useCallback } from "react";
// import { useForm } from "react-hook-form";
// import Swal from "sweetalert2";
// import api from "../../api/axios";
// import PoolCard from "../Pool/PoolCard";

// // =====================
// // AUTH HELPER
// // =====================
// const authHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// });

// // =====================
// // PASSENGER DASHBOARD
// // =====================
// const PassengerDashboard = ({ user, onLogout }) => {
//   // ── View state: "pools" | "joinForm" | "activeRide"
//   const [view, setView] = useState("pools");

//   // ── Pool list
//   const [pools, setPools] = useState([]);
//   const [poolsLoading, setPoolsLoading] = useState(true);
//   const [poolsError, setPoolsError] = useState("");

//   // ── Selected pool (for join form)
//   const [selectedPool, setSelectedPool] = useState(null);

//   // ── Join form state
//   const [joining, setJoining] = useState(false);

//   // ── Active ride (passenger's current ride)
//   const [activeRide, setActiveRide] = useState(null);
//   const [activeRideLoading, setActiveRideLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: { seats: 1 },
//   });

//   // =====================
//   // FETCH AVAILABLE POOLS
//   // =====================
//   const fetchPools = useCallback(async () => {
//     try {
//       setPoolsLoading(true);
//       setPoolsError("");
//       const response = await api.get("/pools", { headers: authHeaders() });
//       setPools(response.data.pools || []);
//     } catch (err) {
//       console.error("Get pools error:", err);
//       setPoolsError(
//         err.response?.data?.message || "Failed to load available pools."
//       );
//     } finally {
//       setPoolsLoading(false);
//     }
//   }, []);

//   // =====================
//   // FETCH ACTIVE RIDE
//   // =====================
//   const fetchActiveRide = useCallback(async () => {
//     try {
//       setActiveRideLoading(true);
//       const response = await api.get("/rides/my-ride", {
//         headers: authHeaders(),
//       });
//       const ride = response.data.ride || null;
//       setActiveRide(ride);

//       // If there is an active ride, switch to that view
//       if (
//         ride &&
//         ["MATCHED", "DRIVER_ARRIVED", "STARTED"].includes(ride.status)
//       ) {
//         setView("activeRide");
//       }
//     } catch (err) {
//       // 404 means no active ride — that's fine
//       if (err.response?.status !== 404) {
//         console.error("Get active ride error:", err);
//       }
//       setActiveRide(null);
//     } finally {
//       setActiveRideLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPools();
//     fetchActiveRide();
//   }, [fetchPools, fetchActiveRide]);

//   // Auto-refresh active ride every 15s when ride is in progress
//   useEffect(() => {
//     if (!activeRide) return;
//     if (activeRide.status === "COMPLETED") return;
//     const interval = setInterval(fetchActiveRide, 15000);
//     return () => clearInterval(interval);
//   }, [fetchActiveRide, activeRide?.status]);

//   // =====================
//   // SELECT POOL → SHOW FORM
//   // =====================
//   const handleSelectPool = (pool) => {
//     setSelectedPool(pool);
//     reset({ seats: 1 });
//     setView("joinForm");
//   };

//   // =====================
//   // JOIN POOL
//   // =====================
//   const handleJoinPool = async (data) => {
//     if (!selectedPool) return;
//     try {
//       setJoining(true);

//       const response = await api.post(
//         "/rides",
//         {
//           poolId: selectedPool.id,
//           pickupAddress: data.pickupAddress,
//           pickupLat: Number(data.pickupLat),
//           pickupLng: Number(data.pickupLng),
//           dropoffAddress: data.dropoffAddress,
//           dropoffLat: Number(data.dropoffLat),
//           dropoffLng: Number(data.dropoffLng),
//           seats: Number(data.seats),
//           estimatedFare: Number(data.estimatedFare),
//         },
//         { headers: authHeaders() }
//       );

//       await Swal.fire({
//         icon: "success",
//         title: "Ride Matched! 🎉",
//         text:
//           response.data.message ||
//           "You have successfully joined the pool. Your ride is matched!",
//         confirmButtonColor: "#f97316",
//       });

//       await fetchActiveRide();
//       setView("activeRide");
//     } catch (err) {
//       console.error("Join pool error:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Failed to Join",
//         text: err.response?.data?.message || "Could not join the pool.",
//         confirmButtonColor: "#f97316",
//       });
//     } finally {
//       setJoining(false);
//     }
//   };

//   // =====================
//   // RIDE STATUS LABEL
//   // =====================
//   const rideStatusConfig = {
//     MATCHED: {
//       label: "Ride Matched",
//       color: "bg-blue-100 text-blue-700",
//       icon: "🎯",
//       desc: "Your driver will arrive soon.",
//     },
//     DRIVER_ARRIVED: {
//       label: "Driver Arrived",
//       color: "bg-orange-100 text-orange-700",
//       icon: "🚗",
//       desc: "Your driver is at the pickup location!",
//     },
//     STARTED: {
//       label: "Ride Started",
//       color: "bg-green-100 text-green-700",
//       icon: "🚀",
//       desc: "You are on your way.",
//     },
//     COMPLETED: {
//       label: "Ride Completed",
//       color: "bg-emerald-100 text-emerald-700",
//       icon: "✅",
//       desc: "Your ride has been completed. Thank you!",
//     },
//   };

//   const passengerName = user?.name || "Passenger";
//   const initial = passengerName.charAt(0).toUpperCase();

//   // =====================
//   // RENDER
//   // =====================
//   return (
//     <div className="min-h-screen bg-[#f4f1e8] text-stone-900 font-sans">

//       {/* ====== HEADER ====== */}
//       <header className="border-b border-stone-200 bg-white sticky top-0 z-10">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center shadow">
//               <span className="text-base font-black text-amber-400">P</span>
//             </div>
//             <p className="text-lg font-black text-black tracking-tight">
//               PoolDhaka
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* Active Ride indicator */}
//             {activeRide &&
//               ["MATCHED", "DRIVER_ARRIVED", "STARTED"].includes(
//                 activeRide.status
//               ) && (
//                 <button
//                   onClick={() => setView("activeRide")}
//                   className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600"
//                 >
//                   <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
//                   Active Ride
//                 </button>
//               )}

//             {/* Nav tabs */}
//             <button
//               onClick={() => setView("pools")}
//               className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
//                 view === "pools"
//                   ? "bg-stone-900 text-white"
//                   : "border border-stone-300 hover:bg-stone-50"
//               }`}
//             >
//               Find Pool
//             </button>

//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-700">
//                 {initial}
//               </div>
//               <span className="text-sm font-medium hidden sm:block">
//                 {passengerName}
//               </span>
//             </div>

//             <button
//               onClick={onLogout}
//               className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-50"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* ====== MAIN ====== */}
//       <main className="mx-auto max-w-5xl px-6 py-8">

//         {/* =====================================
//             ACTIVE RIDE VIEW
//         ===================================== */}
//         {view === "activeRide" && (
//           <div className="space-y-6">

//             {/* Back button if completed */}
//             {activeRide?.status === "COMPLETED" && (
//               <button
//                 onClick={() => {
//                   setActiveRide(null);
//                   setView("pools");
//                   fetchPools();
//                 }}
//                 className="text-sm font-medium text-stone-600 hover:text-stone-900 transition"
//               >
//                 ← Find another pool
//               </button>
//             )}

//             {activeRideLoading ? (
//               <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center">
//                 <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-orange-500" />
//                 <p className="mt-4 text-sm text-stone-500">
//                   Loading your ride...
//                 </p>
//               </div>
//             ) : !activeRide ? (
//               <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center">
//                 <p className="text-5xl mb-4">🚗</p>
//                 <h3 className="text-xl font-bold text-stone-800">
//                   No active ride
//                 </h3>
//                 <p className="mt-2 text-sm text-stone-500">
//                   You don't have an active ride right now.
//                 </p>
//                 <button
//                   onClick={() => setView("pools")}
//                   className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition"
//                 >
//                   Find a Pool
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-5">

//                 {/* Status Card */}
//                 <div className="rounded-3xl bg-stone-900 text-white p-7 shadow-lg">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
//                         Ride Status
//                       </p>
//                       <h2 className="text-3xl font-black">
//                         {rideStatusConfig[activeRide.status]?.icon}{" "}
//                         {rideStatusConfig[activeRide.status]?.label ||
//                           activeRide.status}
//                       </h2>
//                       <p className="mt-2 text-stone-400 text-sm">
//                         {rideStatusConfig[activeRide.status]?.desc}
//                       </p>
//                     </div>

//                     <span
//                       className={`rounded-full px-3 py-1 text-xs font-bold ${
//                         rideStatusConfig[activeRide.status]?.color ||
//                         "bg-stone-100 text-stone-600"
//                       }`}
//                     >
//                       {activeRide.status}
//                     </span>
//                   </div>

//                   {/* Route */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="bg-stone-800 rounded-2xl p-4">
//                       <p className="text-xs text-stone-400 mb-1">Pickup</p>
//                       <p className="text-sm font-semibold">
//                         {activeRide.pickupAddress}
//                       </p>
//                     </div>
//                     <div className="bg-stone-800 rounded-2xl p-4">
//                       <p className="text-xs text-stone-400 mb-1">Drop-off</p>
//                       <p className="text-sm font-semibold">
//                         {activeRide.dropoffAddress}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Seats + Fare */}
//                   <div className="grid grid-cols-2 gap-4 mt-4">
//                     <div className="bg-stone-800 rounded-2xl p-4">
//                       <p className="text-xs text-stone-400 mb-1">Seats</p>
//                       <p className="text-2xl font-black">{activeRide.seats}</p>
//                     </div>
//                     <div className="bg-stone-800 rounded-2xl p-4">
//                       <p className="text-xs text-stone-400 mb-1">Fare</p>
//                       <p className="text-2xl font-black text-amber-400">
//                         ৳{activeRide.estimatedFare}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Driver + Vehicle Card */}
//                 {activeRide.pool && (
//                   <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
//                     <h3 className="text-base font-bold text-stone-800 mb-4">
//                       Your Driver & Vehicle
//                     </h3>

//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-lg font-black text-amber-700 flex-shrink-0">
//                         {(activeRide.pool.driver?.name || "D")
//                           .charAt(0)
//                           .toUpperCase()}
//                       </div>

//                       <div className="flex-1">
//                         <p className="font-bold text-stone-900">
//                           {activeRide.pool.driver?.name || "Driver"}
//                         </p>
//                         <p className="text-sm text-stone-500 mt-0.5">
//                           {activeRide.pool.vehicle?.vehicleName} ·{" "}
//                           {activeRide.pool.vehicle?.plateNumber}
//                         </p>
//                         <p className="text-xs text-stone-400 mt-0.5">
//                           {activeRide.pool.driver?.phone || ""}
//                         </p>
//                       </div>

//                       <div className="text-right">
//                         <p className="text-xs text-stone-400">Pool Seats</p>
//                         <p className="font-bold text-stone-900">
//                           {activeRide.pool.occupiedSeats} /{" "}
//                           {activeRide.pool.maxCapacity}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Refresh Button */}
//                 {activeRide.status !== "COMPLETED" && (
//                   <button
//                     onClick={fetchActiveRide}
//                     disabled={activeRideLoading}
//                     className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition"
//                   >
//                     ↻ Refresh Status
//                   </button>
//                 )}

//                 {/* Completed: find new pool */}
//                 {activeRide.status === "COMPLETED" && (
//                   <button
//                     onClick={() => {
//                       setActiveRide(null);
//                       setView("pools");
//                       fetchPools();
//                     }}
//                     className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition"
//                   >
//                     🎉 Find Another Pool
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* =====================================
//             JOIN FORM VIEW
//         ===================================== */}
//         {view === "joinForm" && selectedPool && (
//           <div>
//             <button
//               onClick={() => {
//                 setSelectedPool(null);
//                 setView("pools");
//               }}
//               className="mb-5 text-sm font-medium text-stone-600 hover:text-stone-900 transition"
//             >
//               ← Back to Pools
//             </button>

//             <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">

//               <h2 className="text-2xl font-bold text-stone-900">
//                 Join Pool
//               </h2>

//               <p className="mt-1 text-sm text-stone-500">
//                 Enter your pickup, drop-off and seats to join this pool.
//               </p>

//               {/* Selected Pool Summary */}
//               <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
//                 <div className="flex items-center gap-4">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl">
//                     🚗
//                   </div>
//                   <div>
//                     <p className="font-bold text-stone-900">
//                       {selectedPool.vehicle?.vehicleName}
//                     </p>
//                     <p className="text-sm text-stone-500 mt-0.5">
//                       Driver: {selectedPool.driver?.name} ·{" "}
//                       {selectedPool.vehicle?.plateNumber}
//                     </p>
//                     <p className="text-xs text-green-600 font-semibold mt-1">
//                       {selectedPool.availableSeats} seat(s) available
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Route Form */}
//               <form
//                 onSubmit={handleSubmit(handleJoinPool)}
//                 className="mt-7 space-y-5"
//               >
//                 {/* Pickup Address */}
//                 <div>
//                   <label className="text-sm font-medium text-stone-700 block mb-1.5">
//                     Pickup Address
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Banani Road 11, Dhaka"
//                     {...register("pickupAddress", {
//                       required: "Pickup address is required",
//                     })}
//                     className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                   />
//                   {errors.pickupAddress && (
//                     <p className="mt-1 text-xs text-red-500">
//                       {errors.pickupAddress.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Pickup Coordinates */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium text-stone-700 block mb-1.5">
//                       Pickup Latitude
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       placeholder="23.7937"
//                       {...register("pickupLat", {
//                         required: "Pickup latitude is required",
//                       })}
//                       className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                     />
//                     {errors.pickupLat && (
//                       <p className="mt-1 text-xs text-red-500">
//                         {errors.pickupLat.message}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-stone-700 block mb-1.5">
//                       Pickup Longitude
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       placeholder="90.4066"
//                       {...register("pickupLng", {
//                         required: "Pickup longitude is required",
//                       })}
//                       className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                     />
//                     {errors.pickupLng && (
//                       <p className="mt-1 text-xs text-red-500">
//                         {errors.pickupLng.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Dropoff Address */}
//                 <div>
//                   <label className="text-sm font-medium text-stone-700 block mb-1.5">
//                     Drop-off Address
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Gulshan 2, Dhaka"
//                     {...register("dropoffAddress", {
//                       required: "Drop-off address is required",
//                     })}
//                     className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                   />
//                   {errors.dropoffAddress && (
//                     <p className="mt-1 text-xs text-red-500">
//                       {errors.dropoffAddress.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Dropoff Coordinates */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium text-stone-700 block mb-1.5">
//                       Drop-off Latitude
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       placeholder="23.7925"
//                       {...register("dropoffLat", {
//                         required: "Drop-off latitude is required",
//                       })}
//                       className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                     />
//                     {errors.dropoffLat && (
//                       <p className="mt-1 text-xs text-red-500">
//                         {errors.dropoffLat.message}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-stone-700 block mb-1.5">
//                       Drop-off Longitude
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       placeholder="90.4078"
//                       {...register("dropoffLng", {
//                         required: "Drop-off longitude is required",
//                       })}
//                       className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                     />
//                     {errors.dropoffLng && (
//                       <p className="mt-1 text-xs text-red-500">
//                         {errors.dropoffLng.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Seats + Fare */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium text-stone-700 block mb-1.5">
//                       Number of Seats
//                     </label>
//                     <select
//                       {...register("seats", {
//                         required: "Please select seats",
//                         valueAsNumber: true,
//                       })}
//                       className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                     >
//                       <option value={1}>1 Seat</option>
//                       <option value={2}>2 Seats</option>
//                       <option value={3}>3 Seats</option>
//                     </select>
//                     {errors.seats && (
//                       <p className="mt-1 text-xs text-red-500">
//                         {errors.seats.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-stone-700 block mb-1.5">
//                       Estimated Fare (৳)
//                     </label>
//                     <input
//                       type="number"
//                       min="1"
//                       placeholder="200"
//                       {...register("estimatedFare", {
//                         required: "Estimated fare is required",
//                         valueAsNumber: true,
//                         min: { value: 1, message: "Fare must be > 0" },
//                       })}
//                       className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                     />
//                     {errors.estimatedFare && (
//                       <p className="mt-1 text-xs text-red-500">
//                         {errors.estimatedFare.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Backend checks note */}
//                 <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
//                   <p className="text-xs text-blue-700 font-semibold">
//                     ✓ Pool availability · ✓ Seat check · ✓ Route within 3km · ✓ Duplicate check
//                   </p>
//                   <p className="text-xs text-blue-500 mt-0.5">
//                     All checks are verified automatically when you submit.
//                   </p>
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={joining}
//                   className="w-full rounded-2xl bg-orange-500 px-5 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {joining ? "Joining Pool..." : "Join Pool →"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* =====================================
//             AVAILABLE POOLS VIEW
//         ===================================== */}
//         {view === "pools" && (
//           <div>
//             {/* Page Header */}
//             <div className="mb-7">
//               <h1 className="text-3xl font-black text-stone-900">
//                 Available Pools
//               </h1>
//               <p className="mt-2 text-stone-500">
//                 Select a pool to view driver & vehicle details, then join with
//                 your pickup and drop-off location.
//               </p>
//             </div>

//             {poolsLoading ? (
//               <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center">
//                 <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-orange-500" />
//                 <p className="mt-4 text-sm text-stone-500">
//                   Loading available pools...
//                 </p>
//               </div>
//             ) : poolsError ? (
//               <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
//                 <p className="text-sm text-red-600">{poolsError}</p>
//                 <button
//                   onClick={fetchPools}
//                   className="mt-4 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 transition"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             ) : pools.length === 0 ? (
//               <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center">
//                 <p className="text-5xl mb-4">🚌</p>
//                 <h3 className="text-xl font-bold text-stone-800">
//                   No available pools
//                 </h3>
//                 <p className="mt-2 text-sm text-stone-500">
//                   Try again later when a driver creates a pool.
//                 </p>
//                 <button
//                   onClick={fetchPools}
//                   className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition"
//                 >
//                   ↻ Refresh
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <div className="flex items-center justify-between mb-5">
//                   <p className="text-sm text-stone-500">
//                     {pools.length} pool(s) available
//                   </p>
//                   <button
//                     onClick={fetchPools}
//                     className="text-sm font-medium text-stone-500 hover:text-stone-900 transition"
//                   >
//                     ↻ Refresh
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
//                   {pools.map((pool) => (
//                     <PoolCard
//                       key={pool.id}
//                       pool={pool}
//                       onJoin={handleSelectPool}
//                     />
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default PassengerDashboard;


// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import {
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";
// import Swal from "sweetalert2";

// import useAuth from "../../hooks/useAuth";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import PoolCard from "../Pool/PoolCard";

// const PassengerDashboard = ({ user: propUser, onLogout }) => {
//   const { user: authUser, logout } = useAuth();
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   const user = propUser || authUser;

//   const [view, setView] = useState("pools");
//   const [selectedPool, setSelectedPool] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     reset,
//   } = useForm({
//     defaultValues: {
//       pickupAddress: "",
//       pickupLat: "",
//       pickupLng: "",
//       dropoffAddress: "",
//       dropoffLat: "",
//       dropoffLng: "",
//       seats: 1,
//       estimatedFare: "",
//     },
//   });

//   // ==========================================
//   // AVAILABLE POOLS
//   // ==========================================

//   const {
//     data: pools = [],
//     isLoading: poolsLoading,
//     isError: poolsIsError,
//     error: poolsError,
//     refetch: refetchPools,
//   } = useQuery({
//     queryKey: ["availablePools"],

//     queryFn: async () => {
//       const response = await axiosSecure.get("/pools");

//       return response.data.pools || [];
//     },
//   });

//   // ==========================================
//   // ACTIVE RIDE
//   // ==========================================

//   const {
//     data: activeRide = null,
//     isLoading: activeRideLoading,
//     refetch: refetchActiveRide,
//   } = useQuery({
//     queryKey: ["myRides"],

//     queryFn: async () => {
//       const response = await axiosSecure.get("/rides/my-rides");

//       const rides = response.data.rides || [];

//       const activeStatuses = [
//         "MATCHED",
//         "DRIVER_ARRIVED",
//         "STARTED",
//       ];

//       return (
//         rides.find((ride) =>
//           activeStatuses.includes(ride.status)
//         ) || null
//       );
//     },

//     refetchInterval: (query) => {
//       const ride = query.state.data;

//       if (
//         ride &&
//         ["MATCHED", "DRIVER_ARRIVED", "STARTED"].includes(
//           ride.status
//         )
//       ) {
//         return 15000;
//       }

//       return false;
//     },
//   });

//   // ==========================================
//   // JOIN POOL MUTATION
//   // ==========================================

//   const joinPoolMutation = useMutation({
//     mutationFn: async ({ pool, data }) => {
//       // Step 1:
//       // Create ride request
//       const rideResponse = await axiosSecure.post("/rides", {
//         pickupAddress: data.pickupAddress,
//         pickupLat: Number(data.pickupLat),
//         pickupLng: Number(data.pickupLng),

//         dropoffAddress: data.dropoffAddress,
//         dropoffLat: Number(data.dropoffLat),
//         dropoffLng: Number(data.dropoffLng),

//         seats: Number(data.seats),
//         estimatedFare: Number(data.estimatedFare),
//       });

//       const rideRequestId = rideResponse.data.ride?.id;

//       if (!rideRequestId) {
//         throw new Error(
//           "Ride request ID was not returned."
//         );
//       }

//       // Step 2:
//       // Join the selected pool
//       const joinResponse = await axiosSecure.post(
//         "/pools/join",
//         {
//           poolId: pool.id,
//           rideRequestId,
//         }
//       );

//       return joinResponse.data;
//     },

//     onSuccess: async () => {
//       // Refresh available pools
//       await queryClient.invalidateQueries({
//         queryKey: ["availablePools"],
//       });

//       // Refresh passenger rides
//       await queryClient.invalidateQueries({
//         queryKey: ["myRides"],
//       });

//       setSelectedPool(null);

//       reset();

//       setView("activeRide");

//       await Swal.fire({
//         icon: "success",
//         title: "Ride Matched! 🎉",
//         text: "You have successfully joined the pool.",
//         confirmButtonColor: "#f97316",
//       });
//     },

//     onError: (error) => {
//       console.error("Join pool error:", error);

//       Swal.fire({
//         icon: "error",
//         title: "Failed to Join",
//         text:
//           error.response?.data?.message ||
//           error.message ||
//           "Could not join the pool.",
//         confirmButtonColor: "#f97316",
//       });
//     },
//   });

//   // ==========================================
//   // SELECT POOL
//   // ==========================================

//   const handleSelectPool = (pool) => {
//     setSelectedPool(pool);

//     reset({
//       pickupAddress: "",
//       pickupLat: "",
//       pickupLng: "",
//       dropoffAddress: "",
//       dropoffLat: "",
//       dropoffLng: "",
//       seats: 1,
//       estimatedFare: "",
//     });

//     setView("joinForm");
//   };

//   // ==========================================
//   // JOIN POOL
//   // ==========================================

//   const handleJoinPool = (data) => {
//     if (!selectedPool) {
//       Swal.fire({
//         icon: "warning",
//         title: "No Pool Selected",
//         text: "Please select a pool first.",
//         confirmButtonColor: "#f97316",
//       });

//       return;
//     }

//     joinPoolMutation.mutate({
//       pool: selectedPool,
//       data,
//     });
//   };

//   // ==========================================
//   // LOGOUT
//   // ==========================================

//   const handleLogout = () => {
//     if (onLogout) {
//       onLogout();
//     } else {
//       logout();
//     }
//   };

//   // ==========================================
//   // POOL VIEW
//   // ==========================================

//   const renderPools = () => {
//     if (poolsLoading) {
//       return (
//         <div className="flex min-h-[300px] items-center justify-center">
//           <div className="text-center">
//             <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>

//             <p className="text-gray-600">
//               Loading available pools...
//             </p>
//           </div>
//         </div>
//       );
//     }

//     if (poolsIsError) {
//       return (
//         <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
//           <p className="font-medium text-red-600">
//             {poolsError?.response?.data?.message ||
//               "Failed to load available pools."}
//           </p>

//           <button
//             type="button"
//             onClick={() => refetchPools()}
//             className="mt-4 rounded-lg bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600"
//           >
//             Try Again
//           </button>
//         </div>
//       );
//     }

//     if (!pools.length) {
//       return (
//         <div className="rounded-2xl border border-orange-100 bg-white p-10 text-center shadow-sm">
//           <div className="mb-4 text-5xl">🚗</div>

//           <h3 className="text-xl font-semibold text-gray-800">
//             No Available Pools
//           </h3>

//           <p className="mt-2 text-gray-500">
//             There are currently no open pools available.
//           </p>

//           <button
//             type="button"
//             onClick={() => refetchPools()}
//             className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600"
//           >
//             Refresh
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div>
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">
//               Available Pools
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               Choose an available driver pool and request a seat.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => refetchPools()}
//             className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
//           >
//             ↻ Refresh
//           </button>
//         </div>

//         <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
//           {pools.map((pool) => (
//             <PoolCard
//               key={pool.id}
//               pool={pool}
//               onJoin={handleSelectPool}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // ==========================================
//   // JOIN FORM
//   // ==========================================

//   const renderJoinForm = () => {
//     if (!selectedPool) {
//       return (
//         <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
//           <p className="text-gray-600">
//             Please select a pool first.
//           </p>

//           <button
//             type="button"
//             onClick={() => setView("pools")}
//             className="mt-4 rounded-lg bg-orange-500 px-5 py-2.5 text-white"
//           >
//             Back to Pools
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div className="mx-auto max-w-3xl">
//         <button
//           type="button"
//           onClick={() => {
//             setSelectedPool(null);
//             setView("pools");
//           }}
//           className="mb-5 text-sm font-medium text-orange-600 hover:text-orange-700"
//         >
//           ← Back to Available Pools
//         </button>

//         <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm md:p-8">
//           <div className="mb-7">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Join Pool
//             </h2>

//             <p className="mt-1 text-gray-500">
//               Enter your ride details to join this driver's pool.
//             </p>
//           </div>

//           {/* Selected Pool */}
//           <div className="mb-7 rounded-xl bg-orange-50 p-5">
//             <div className="mb-3 flex items-center justify-between">
//               <h3 className="font-semibold text-gray-800">
//                 Selected Pool
//               </h3>

//               <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
//                 OPEN
//               </span>
//             </div>

//             <div className="grid gap-3 sm:grid-cols-2">
//               <div>
//                 <p className="text-xs text-gray-500">
//                   Driver
//                 </p>

//                 <p className="font-medium text-gray-800">
//                   {selectedPool.driver?.name || "Driver"}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs text-gray-500">
//                   Vehicle
//                 </p>

//                 <p className="font-medium text-gray-800">
//                   {selectedPool.vehicle?.vehicleName ||
//                     "Tesla"}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs text-gray-500">
//                   Vehicle Type
//                 </p>

//                 <p className="font-medium text-gray-800">
//                   {selectedPool.vehicle?.vehicleType ||
//                     "SEDAN"}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs text-gray-500">
//                   Available Seats
//                 </p>

//                 <p className="font-medium text-gray-800">
//                   {selectedPool.availableSeats ??
//                     selectedPool.maxCapacity}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <form
//             onSubmit={handleSubmit(handleJoinPool)}
//             className="space-y-5"
//           >
//             {/* Pickup Address */}
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Pickup Address
//               </label>

//               <input
//                 type="text"
//                 placeholder="e.g. Banani Road 11"
//                 {...register("pickupAddress", {
//                   required: "Pickup address is required",
//                 })}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//               />
//             </div>

//             {/* Pickup Coordinates */}
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Pickup Latitude
//                 </label>

//                 <input
//                   type="number"
//                   step="any"
//                   placeholder="e.g. 23.7937"
//                   {...register("pickupLat", {
//                     required: "Pickup latitude is required",
//                   })}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Pickup Longitude
//                 </label>

//                 <input
//                   type="number"
//                   step="any"
//                   placeholder="e.g. 90.4066"
//                   {...register("pickupLng", {
//                     required: "Pickup longitude is required",
//                   })}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 />
//               </div>
//             </div>

//             {/* Dropoff Address */}
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Dropoff Address
//               </label>

//               <input
//                 type="text"
//                 placeholder="e.g. Gulshan 1"
//                 {...register("dropoffAddress", {
//                   required: "Dropoff address is required",
//                 })}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//               />
//             </div>

//             {/* Dropoff Coordinates */}
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Dropoff Latitude
//                 </label>

//                 <input
//                   type="number"
//                   step="any"
//                   placeholder="e.g. 23.7806"
//                   {...register("dropoffLat", {
//                     required: "Dropoff latitude is required",
//                   })}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Dropoff Longitude
//                 </label>

//                 <input
//                   type="number"
//                   step="any"
//                   placeholder="e.g. 90.4169"
//                   {...register("dropoffLng", {
//                     required: "Dropoff longitude is required",
//                   })}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 />
//               </div>
//             </div>

//             {/* Seats + Fare */}
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Seats
//                 </label>

//                 <select
//                   {...register("seats", {
//                     required: true,
//                   })}
//                   className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 >
//                   <option value="1">
//                     1 Seat
//                   </option>

//                   <option value="2">
//                     2 Seats
//                   </option>

//                   <option value="3">
//                     3 Seats
//                   </option>
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Estimated Fare
//                 </label>

//                 <input
//                   type="number"
//                   min="1"
//                   placeholder="e.g. 300"
//                   {...register("estimatedFare", {
//                     required: "Estimated fare is required",
//                     min: 1,
//                   })}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 />
//               </div>
//             </div>

//             {/* Info */}
//             <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
//               <p>
//                 💡 Your pickup and dropoff locations must be
//                 within the pool's matching distance.
//               </p>

//               <p className="mt-1">
//                 The final pool fare will be calculated by the
//                 backend.
//               </p>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-col gap-3 pt-3 sm:flex-row">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSelectedPool(null);
//                   setView("pools");
//                 }}
//                 className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={joinPoolMutation.isPending}
//                 className="flex-1 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {joinPoolMutation.isPending
//                   ? "Joining Pool..."
//                   : "Join Pool →"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   // ==========================================
//   // ACTIVE RIDE
//   // ==========================================

//   const renderActiveRide = () => {
//     if (activeRideLoading) {
//       return (
//         <div className="flex min-h-[300px] items-center justify-center">
//           <div className="text-center">
//             <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>

//             <p className="text-gray-600">
//               Loading your active ride...
//             </p>
//           </div>
//         </div>
//       );
//     }

//     if (!activeRide) {
//       return (
//         <div className="rounded-2xl border border-orange-100 bg-white p-10 text-center shadow-sm">
//           <div className="mb-4 text-5xl">🚘</div>

//           <h2 className="text-2xl font-bold text-gray-800">
//             No Active Ride
//           </h2>

//           <p className="mt-2 text-gray-500">
//             You don't currently have an active ride.
//           </p>

//           <button
//             type="button"
//             onClick={() => {
//               setView("pools");
//               refetchPools();
//               refetchActiveRide();
//             }}
//             className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600"
//           >
//             Find a Pool
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div className="mx-auto max-w-3xl">
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">
//               Active Ride
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               Your ride status will update automatically.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => refetchActiveRide()}
//             className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50"
//           >
//             ↻ Refresh
//           </button>
//         </div>

//         {/* Status */}
//         <div className="mb-5 rounded-2xl bg-white p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">
//                 Ride Status
//               </p>

//               <h3 className="mt-1 text-2xl font-bold text-orange-600">
//                 {activeRide.status}
//               </h3>
//             </div>

//             <div className="rounded-full bg-orange-100 px-4 py-2 text-2xl">
//               🚗
//             </div>
//           </div>
//         </div>

//         {/* Driver */}
//         <div className="mb-5 rounded-2xl bg-white p-6 shadow-sm">
//           <h3 className="mb-5 text-lg font-bold text-gray-800">
//             Driver & Vehicle
//           </h3>

//           <div className="grid gap-5 sm:grid-cols-2">
//             <div>
//               <p className="text-xs text-gray-500">
//                 Driver
//               </p>

//               <p className="mt-1 font-semibold text-gray-800">
//                 {activeRide.pool?.driver?.name ||
//                   "Driver information unavailable"}
//               </p>

//               {activeRide.pool?.driver?.phone && (
//                 <p className="mt-1 text-sm text-gray-500">
//                   {activeRide.pool.driver.phone}
//                 </p>
//               )}
//             </div>

//             <div>
//               <p className="text-xs text-gray-500">
//                 Vehicle
//               </p>

//               <p className="mt-1 font-semibold text-gray-800">
//                 {activeRide.pool?.vehicle?.vehicleName ||
//                   "Vehicle information unavailable"}
//               </p>

//               {activeRide.pool?.vehicle?.plateNumber && (
//                 <p className="mt-1 text-sm text-gray-500">
//                   Plate:{" "}
//                   {activeRide.pool.vehicle.plateNumber}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Route */}
//         <div className="mb-5 rounded-2xl bg-white p-6 shadow-sm">
//           <h3 className="mb-5 text-lg font-bold text-gray-800">
//             Your Route
//           </h3>

//           <div className="space-y-5">
//             <div className="flex gap-4">
//               <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500">
//                 <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
//               </div>

//               <div>
//                 <p className="text-xs text-gray-500">
//                   Pickup
//                 </p>

//                 <p className="font-medium text-gray-800">
//                   {activeRide.pickupAddress}
//                 </p>
//               </div>
//             </div>

//             <div className="ml-[7px] h-6 border-l-2 border-dashed border-gray-300"></div>

//             <div className="flex gap-4">
//               <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500">
//                 <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
//               </div>

//               <div>
//                 <p className="text-xs text-gray-500">
//                   Dropoff
//                 </p>

//                 <p className="font-medium text-gray-800">
//                   {activeRide.dropoffAddress}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Ride Info */}
//         <div className="mb-5 rounded-2xl bg-white p-6 shadow-sm">
//           <h3 className="mb-5 text-lg font-bold text-gray-800">
//             Ride Information
//           </h3>

//           <div className="grid gap-5 sm:grid-cols-3">
//             <div>
//               <p className="text-xs text-gray-500">
//                 Seats
//               </p>

//               <p className="mt-1 text-lg font-semibold text-gray-800">
//                 {activeRide.seats}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500">
//                 Estimated Fare
//               </p>

//               <p className="mt-1 text-lg font-semibold text-gray-800">
//                 ৳{activeRide.estimatedFare}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500">
//                 Pool Fare
//               </p>

//               <p className="mt-1 text-lg font-semibold text-orange-600">
//                 ৳
//                 {activeRide.poolFare ??
//                   activeRide.membership?.fareAmount ??
//                   "—"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Status message */}
//         <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
//           {activeRide.status === "MATCHED" && (
//             <p className="font-medium text-orange-700">
//               ⏳ Your ride is matched. Please wait for the
//               driver.
//             </p>
//           )}

//           {activeRide.status === "DRIVER_ARRIVED" && (
//             <p className="font-medium text-orange-700">
//               📍 The driver has arrived at the pickup point.
//             </p>
//           )}

//           {activeRide.status === "STARTED" && (
//             <p className="font-medium text-orange-700">
//               🚗 Your ride has started. Have a safe journey!
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // ==========================================
//   // MAIN RENDER
//   // ==========================================

//   return (
//     <div className="min-h-screen bg-[#fffaf5]">
//       {/* Header */}
//       <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 backdrop-blur">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
//           <div>
//             <h1 className="text-xl font-bold text-gray-800">
//               Dhaka Tesla Pool
//             </h1>

//             <p className="hidden text-xs text-gray-500 sm:block">
//               Share a seat. Split the fare.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() => {
//                 setView("pools");
//                 setSelectedPool(null);
//                 refetchPools();
//               }}
//               className={`hidden rounded-lg px-4 py-2 text-sm font-medium transition sm:block ${
//                 view === "pools"
//                   ? "bg-orange-500 text-white"
//                   : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
//               }`}
//             >
//               Find Pool
//             </button>

//             <button
//               type="button"
//               onClick={() => {
//                 setView("activeRide");
//                 refetchActiveRide();
//               }}
//               className={`relative rounded-lg px-4 py-2 text-sm font-medium transition ${
//                 view === "activeRide"
//                   ? "bg-orange-500 text-white"
//                   : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
//               }`}
//             >
//               Active Ride

//               {activeRide && (
//                 <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
//               )}
//             </button>

//             <div className="hidden text-right md:block">
//               <p className="text-sm font-semibold text-gray-800">
//                 {user?.name || "Passenger"}
//               </p>

//               <p className="text-xs text-gray-500">
//                 {user?.email}
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={handleLogout}
//               className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Navigation */}
//       <div className="border-b border-orange-100 bg-white px-4 py-3 sm:hidden">
//         <div className="grid grid-cols-2 gap-2">
//           <button
//             type="button"
//             onClick={() => {
//               setView("pools");
//               setSelectedPool(null);
//               refetchPools();
//             }}
//             className={`rounded-lg px-3 py-2 text-sm font-medium ${
//               view === "pools"
//                 ? "bg-orange-500 text-white"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             Find Pool
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               setView("activeRide");
//               refetchActiveRide();
//             }}
//             className={`rounded-lg px-3 py-2 text-sm font-medium ${
//               view === "activeRide"
//                 ? "bg-orange-500 text-white"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             Active Ride
//           </button>
//         </div>
//       </div>

//       {/* Main */}
//       <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         {view === "pools" && renderPools()}

//         {view === "joinForm" && renderJoinForm()}

//         {view === "activeRide" && renderActiveRide()}
//       </main>
//     </div>
//   );
// };

// export default PassengerDashboard;


import React, { useEffect, useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PoolCard from '../Pool/PoolCard';
import Swal from 'sweetalert2';

const PassengerDashboard = ({ user, onLogout }) => {
  const axiosSecure = useAxiosSecure();

  const [view, setView] = useState("pools");
  const [selectedPool, setSelectedPool] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    data: pools = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["availablePools"],
    queryFn: async () => {
      const response = await axiosSecure.get("/pools");

      return response.data.pools || [];
    },
  });
  console.log(pools);

  const {
    data: myRides = [],
    isLoading: ridesLoading,
    isError: ridesError,
  } = useQuery({
    queryKey: ["myRides"],
    queryFn: async () => {
      const response = await axiosSecure.get("/rides/my-rides");

      return response.data.rides || [];
    },
    refetchInterval: 15000,
  });

  const handleSelectPool = (pool) => {
    console.log("Selected pool:", pool);

    setSelectedPool(pool);
    setView("joinForm");
  };

  const handleRideRequestSubmit = async (data) => {
    try {
      const response = await axiosSecure.post("/rides", {
        pickupAddress: data.pickupAddress,
        pickupLat: Number(data.pickupLat),
        pickupLng: Number(data.pickupLng),
        dropoffAddress: data.dropoffAddress,
        dropoffLat: Number(data.dropoffLat),
        dropoffLng: Number(data.dropoffLng),
        seats: Number(data.seats),
        estimatedFare: Number(data.estimatedFare),
      });

      console.log("Ride created:", response.data);
      const ride = response.data.ride;

      const joinResponse = await axiosSecure.post("/pools/join", {
        poolId: selectedPool.id,
        rideRequestId: ride.id,
      });

      console.log("Pool joined:", joinResponse.data);
      await Swal.fire({
        icon: "success",
        title: "Pool Joined!",
        text: "You have successfully joined the pool.",
        confirmButtonColor: "#f97316",
      });

      reset();

      setSelectedPool(null);
      setView("activeRide");

    } catch (error) {
      console.error("Ride request error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text:
          error.response?.data?.message ||
          "Failed to create ride request.",
        confirmButtonColor: "#f97316",
      });
    }
  };
  const activeRide = myRides.find(
    (ride) =>
      ride.status === "MATCHED" ||
      ride.status === "DRIVER_ARRIVED" ||
      ride.status === "STARTED"
  );

  useEffect(() => {
    if (ridesLoading) return;

    if (activeRide) {
      setView("activeRide");
    } else {
      setView("pools");
    }
  }, [activeRide, ridesLoading]);

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
              Loading available pools...
            </p>
          </div>
        </main>
      </div>
    );
  }
  // =========================
  // POOL ERROR
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
              Failed to load pools
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
          {view === "pools" && (
            <div>
              {pools.map((pool) => (
                <PoolCard
                  key={pool.id}
                  pool={pool}
                  onJoin={handleSelectPool}
                />
              ))}
            </div>
          )}

          {view === "joinForm" && selectedPool && (
            <>
              <div className="rounded-3xl border border-stone-200 bg-[#f4f1e8] p-8 shadow-sm">
                {/* <button
                onClick={() => {
                  setSelectedPool(null);
                  setView("pools");
                }}
                className="mb-6 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                ← Back to Pools
              </button> */}

                <h2 className="text-2xl font-black text-stone-900">
                  Ride Request
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  You selected a pool with{" "}
                  <span className="font-semibold text-stone-700">
                    {selectedPool.driver?.name}
                  </span>
                </p>

                <div className="mt-6 rounded-2xl  p-5">
                  <p className="text-sm text-stone-500">
                    Vehicle
                  </p>

                  <p className="mt-1 font-bold text-stone-900">
                    {selectedPool.vehicle?.vehicleName}
                  </p>

                  <p className="mt-1 text-sm text-stone-500">
                    {selectedPool.vehicle?.vehicleType} ·{" "}
                    {selectedPool.vehicle?.plateNumber}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-green-600">
                    {selectedPool.availableSeats} seats available
                  </p>
                </div>
              </div>
              <form
                onSubmit={handleSubmit(handleRideRequestSubmit)}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="text-sm font-semibold text-stone-700">
                    Pickup Address
                  </label>

                  <input
                    {...register("pickupAddress", {
                      required: "Pickup address is required",
                    })}
                    placeholder="e.g. Banani Road 11"
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
                  />

                  {errors.pickupAddress && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.pickupAddress.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-stone-700">
                      Pickup Latitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      {...register("pickupLat", {
                        required: "Pickup latitude is required",
                      })}
                      placeholder="23.7937"
                      className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-stone-700">
                      Pickup Longitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      {...register("pickupLng", {
                        required: "Pickup longitude is required",
                      })}
                      placeholder="90.4066"
                      className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700">
                    Dropoff Address
                  </label>

                  <input
                    {...register("dropoffAddress", {
                      required: "Dropoff address is required",
                    })}
                    placeholder="e.g. Gulshan 1"
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
                  />

                  {errors.dropoffAddress && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.dropoffAddress.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-stone-700">
                      Dropoff Latitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      {...register("dropoffLat", {
                        required: "Dropoff latitude is required",
                      })}
                      placeholder="23.7806"
                      className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-stone-700">
                      Dropoff Longitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      {...register("dropoffLng", {
                        required: "Dropoff longitude is required",
                      })}
                      placeholder="90.4169"
                      className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700">
                    Number of Seats
                  </label>

                  <select
                    {...register("seats", {
                      required: "Please select seats",
                    })}
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
                  >
                    <option value="">Select seats</option>
                    <option value="1">1 Seat</option>
                    <option value="2">2 Seats</option>
                    <option value="3">3 Seats</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700">
                    Estimated Fare
                  </label>

                  <input
                    type="number"
                    {...register("estimatedFare", {
                      required: "Estimated fare is required",
                      min: {
                        value: 1,
                        message: "Fare must be greater than 0",
                      },
                    })}
                    placeholder="300"
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
                  />

                  {errors.estimatedFare && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.estimatedFare.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  Request Ride
                </button>
              </form>
            </>
          )}

          {view === "activeRide" && (
            <div className="rounded-3xl border border-stone-200 bg-[#f4f1e8] p-8 shadow-sm">

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-stone-900">
                    Active Ride
                  </h2>

                  <p className="mt-1 text-sm text-stone-500">
                    Your ride is being processed.
                  </p>
                </div>

                {activeRide && (
                  <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                    {activeRide.status.replaceAll("_", " ")}
                  </span>
                )}
              </div>

              {ridesLoading ? (
                <div className="mt-8 text-sm text-stone-500">
                  Loading ride details...
                </div>
              ) : !activeRide ? (
                <div className="mt-8 rounded-2xl  p-6 text-center">
                  <p className="font-semibold text-stone-700">
                    No active ride found.
                  </p>
                </div>
              ) : (
                <div className="mt-8 space-y-6">

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div className="rounded-2xl  p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                        Pickup
                      </p>

                      <p className="mt-2 font-bold text-stone-900">
                        {activeRide.pickupAddress}
                      </p>
                    </div>

                    <div className="rounded-2xl  p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                        Dropoff
                      </p>

                      <p className="mt-2 font-bold text-stone-900">
                        {activeRide.dropoffAddress}
                      </p>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div>
                      <p className="text-xs text-stone-400">
                        Seats
                      </p>

                      <p className="mt-1 font-bold text-stone-900">
                        {activeRide.seats}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-stone-400">
                        Estimated Fare
                      </p>

                      <p className="mt-1 font-bold text-stone-900">
                        ৳{activeRide.estimatedFare}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-stone-400">
                        Ride Status
                      </p>

                      <p className="mt-1 font-bold text-orange-600">
                        {activeRide.status.replaceAll("_", " ")}
                      </p>
                    </div>

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

          {/* PASSENGER INFO */}

          <div className="rounded-3xl border border-stone-200 bg-[#fffcef] p-6 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-700">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "D"}
              </div>

              <div className="min-w-0">

                <p className="truncate font-bold">
                  {user?.name || "Passenger"}
                </p>

                <p className="truncate text-sm text-stone-500">
                  Passenger
                </p>

              </div>

            </div>

            {user?.email && (
              <p className="mt-4 truncate text-xs text-stone-400">
                {user.email}
              </p>
            )}

          </div>
        </aside>
      </main>
    </div>
  )
}

export default PassengerDashboard
