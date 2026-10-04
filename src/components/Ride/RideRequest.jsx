import { useForm } from "react-hook-form";
import api from "../../api/axios";

const RideRequest = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      seats: 1,
    },
  });

  const handleRideRequest = async (data) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/rides",
        {
          pickupAddress: data.pickupAddress,
          pickupLat: Number(data.pickupLat),
          pickupLng: Number(data.pickupLng),
          dropoffAddress: data.dropoffAddress,
          dropoffLat: Number(data.dropoffLat),
          dropoffLng: Number(data.dropoffLng),
          estimatedFare: Number(data.estimatedFare),
          seats: Number(data.seats),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Ride created:", response.data);

      alert("Ride request created successfully!");

      reset({
        seats: 1,
      });
    } catch (error) {
      console.error("Ride request error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create ride request"
      );
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Request a Ride
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter your trip details and choose how many seats you need.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleRideRequest)}
        className="space-y-5"
      >
        {/* Pickup Address */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Pickup Address
          </label>

          <input
            type="text"
            placeholder="e.g. Banani Road 11, Dhaka"
            {...register("pickupAddress", {
              required: "Pickup address is required",
            })}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />

          {errors.pickupAddress && (
            <p className="mt-1 text-xs text-red-500">
              {errors.pickupAddress.message}
            </p>
          )}
        </div>

        {/* Pickup Coordinates */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Pickup Latitude
            </label>

            <input
              type="number"
              step="any"
              placeholder="23.7937"
              {...register("pickupLat", {
                required: "Pickup latitude is required",
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            {errors.pickupLat && (
              <p className="mt-1 text-xs text-red-500">
                {errors.pickupLat.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Pickup Longitude
            </label>

            <input
              type="number"
              step="any"
              placeholder="90.4066"
              {...register("pickupLng", {
                required: "Pickup longitude is required",
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            {errors.pickupLng && (
              <p className="mt-1 text-xs text-red-500">
                {errors.pickupLng.message}
              </p>
            )}
          </div>
        </div>

        {/* Dropoff Address */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Destination
          </label>

          <input
            type="text"
            placeholder="e.g. Gulshan 2, Dhaka"
            {...register("dropoffAddress", {
              required: "Destination is required",
            })}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />

          {errors.dropoffAddress && (
            <p className="mt-1 text-xs text-red-500">
              {errors.dropoffAddress.message}
            </p>
          )}
        </div>

        {/* Dropoff Coordinates */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Destination Latitude
            </label>

            <input
              type="number"
              step="any"
              placeholder="23.7925"
              {...register("dropoffLat", {
                required: "Destination latitude is required",
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            {errors.dropoffLat && (
              <p className="mt-1 text-xs text-red-500">
                {errors.dropoffLat.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Destination Longitude
            </label>

            <input
              type="number"
              step="any"
              placeholder="90.4078"
              {...register("dropoffLng", {
                required: "Destination longitude is required",
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            {errors.dropoffLng && (
              <p className="mt-1 text-xs text-red-500">
                {errors.dropoffLng.message}
              </p>
            )}
          </div>
        </div>

        {/* Seats + Fare */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Seats */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Number of Seats
            </label>

            <select
              {...register("seats", {
                required: "Please select seats",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Minimum 1 seat",
                },
                max: {
                  value: 4,
                  message: "Maximum 4 seats",
                },
              })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
              <option value={1}>1 Seat</option>
              <option value={2}>2 Seats</option>
              <option value={3}>3 Seats</option>
              <option value={4}>4 Seats</option>
            </select>

            {errors.seats && (
              <p className="mt-1 text-xs text-red-500">
                {errors.seats.message}
              </p>
            )}
          </div>

          {/* Estimated Fare */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Estimated Fare (৳)
            </label>

            <input
              type="number"
              min="1"
              placeholder="300"
              {...register("estimatedFare", {
                required: "Estimated fare is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Fare must be greater than 0",
                },
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            {errors.estimatedFare && (
              <p className="mt-1 text-xs text-red-500">
                {errors.estimatedFare.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating Ride..." : "Request Ride"}
        </button>
      </form>
    </div>
  );
};

export default RideRequest;