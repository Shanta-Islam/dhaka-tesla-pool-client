const PoolCard = ({ pool, onJoin }) => {
  return (
    <div className="rounded-3xl border border-stone-200 bg-[#fffcef]  p-7 shadow-sm">

      {/* Pool Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900">
            {pool?.vehicle?.vehicleName || "Tesla Vehicle"}
          </h3>

          <p className="mt-1 text-sm text-stone-500">
            Driver: {pool?.driver?.name}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            pool?.status === "OPEN"
              ? "bg-green-100 text-green-700"
              : pool?.status === "FULL"
              ? "bg-orange-100 text-orange-700"
              : "bg-stone-100 text-stone-600"
          }`}
        >
          {pool?.status}
        </span>
      </div>

      {/* Vehicle Info */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3">
          <p className="text-xs text-stone-500">Vehicle</p>
          <p className="mt-1 text-sm font-semibold text-stone-800">
            {pool?.vehicle?.vehicleName}
          </p>
        </div>

        <div className="rounded-xl  p-3">
          <p className="text-xs text-stone-500">Plate</p>
          <p className="mt-1 text-sm font-semibold text-stone-800">
            {pool?.vehicle?.plateNumber}
          </p>
        </div>
      </div>

      {/* Seats */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3">
          <p className="text-xs text-stone-500">Occupied Seats</p>
          <p className="mt-1 text-sm font-semibold text-stone-800">
            {pool?.occupiedSeats} / {pool?.maxCapacity}
          </p>
        </div>

        <div className="rounded-xl p-3">
          <p className="text-xs text-stone-500">Available Seats</p>
          <p className={`mt-1 text-sm font-semibold ${pool?.availableSeats > 0 ? "text-green-600" : "text-red-500"}`}>
            {pool?.availableSeats}
          </p>
        </div>
      </div>

      {/* Current Passengers */}
      <div className="mt-4">
        <p className="text-xs text-stone-500">Current passengers</p>
        <p className="mt-1 text-sm font-medium text-stone-700">
          {pool?.activeMemberCount} passenger
          {pool?.activeMemberCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Join Button */}
      <button
        onClick={() => onJoin(pool)}
        disabled={pool?.availableSeats <= 0}
        className="mt-5 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pool?.availableSeats > 0 ? "Join Pool" : "Pool Full"}
      </button>
    </div>
  );
};

export default PoolCard;