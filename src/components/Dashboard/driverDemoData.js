// ─── Static demo data ─────────────────────────────────────────────────────────
const demoVehicle = {
  id: 1,
  vehicleName: "Tesla Model 3",
  vehicleType: "SEDAN",
  plateNumber: "DHAKA-METRO-GA-1234",
  capacity: 3,
};

const demoPassengers = [
  {
    id: 1,
    name: "Shanta Islam",
    pickup: "Banani",
    dropoff: "Gulshan",
    fare: 240,
  },
  {
    id: 2,
    name: "Rafiq Ahmed",
    pickup: "Banani",
    dropoff: "Gulshan",
    fare: 280,
  },
  {
    id: 3,
    name: "Shirin Ahmed",
    pickup: "Banani",
    dropoff: "Gulshan",
    fare: 200,
  },
];

const recentRides = [
  {
    id: 1,
    status: "Completed",
    statusColor: "bg-emerald-100 text-emerald-700",
    fare: "৳180",
    route: "Mohakhali → Gulshan 1",
    meta: "Shirin · 12 Jun · 14:20",
  },
  {
    id: 2,
    status: "Cancelled",
    statusColor: "bg-red-100 text-red-600",
    fare: "—",
    route: "Banani Road 11 → Mohakhali",
    meta: "Nusrat · 8 Jun · 09:05",
  },
  {
    id: 3,
    status: "Completed",
    statusColor: "bg-emerald-100 text-emerald-700",
    fare: "৳240",
    route: "Gulshan 1 → Banani Road 11",
    meta: "Rafiq · 2 Jun · 19:40",
  },
];

export { demoVehicle, demoPassengers, recentRides };
