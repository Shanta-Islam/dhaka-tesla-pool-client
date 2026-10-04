
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import api from "./api/axios";
// import jashimDriver from "./assets/driver.jpg"

// function App() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [selectedRole, setSelectedRole] = useState("PASSENGER");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   // =========================
//   // LOGIN
//   // =========================

//   const handleLogin = async (data) => {
//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");

//       const response = await api.post("/auth/login", {
//         email: data.email,
//         password: data.password,
//       });

//       console.log("Login response:", response.data);

//       const token = response.data.token;

//       if (!token) {
//         throw new Error("Token not received");
//       }

//       localStorage.setItem("token", token);

//       setSuccess("Login successful!");

//       reset();

//     } catch (error) {
//       console.error("Login error:", error);

//       setError(
//         error.response?.data?.message ||
//           error.message ||
//           "Login failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // REGISTER
//   // =========================

//   const handleRegister = async (data) => {
//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");

//       const response = await api.post("/auth/register", {
//         name: data.name,
//         email: data.email,
//         password: data.password,
//         phone: data.phone,
//         role: selectedRole,
//       });

//       console.log("Register response:", response.data);

//       setSuccess(
//         "Account created successfully! Please login."
//       );

//       // Go back to login
//       setIsLogin(true);

//       // Keep email so user doesn't have to type it again
//       reset({
//         email: data.email,
//         password: "",
//       });

//       // Reset role
//       setSelectedRole("PASSENGER");

//     } catch (error) {
//       console.error("Register error:", error);

//       setError(
//         error.response?.data?.message ||
//           error.message ||
//           "Registration failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // SWITCH LOGIN / REGISTER
//   // =========================

//   const switchToLogin = () => {
//     setIsLogin(true);
//     setError("");
//     setSuccess("");

//     reset();
//   };

//   const switchToRegister = () => {
//     setIsLogin(false);
//     setError("");
//     setSuccess("");

//     setSelectedRole("PASSENGER");

//     reset();
//   };

//   // =========================
//   // SWITCH ROLE
//   // =========================

//   const selectRole = (role) => {
//     setSelectedRole(role);
//     setError("");
//   };



//   return (
//     <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

//       {/* ========================================= */}
//       {/* MAIN CONTAINER */}
//       {/* ========================================= */}

//       <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

//         {/* ========================================= */}
//         {/* LEFT SIDE */}
//         {/* ========================================= */}

//         <aside className="hidden lg:block rounded-[28px] bg-slate-900 border border-slate-800 p-8 xl:p-10 shadow-2xl">

//           {/* Logo */}

//           <div className="flex items-center gap-3">

//             <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500 shadow-lg shadow-cyan-500/20">

//               <span className="text-2xl font-black text-slate-950">
//                 T
//               </span>

//             </div>

//             <div>

//               <p className="text-xl font-black tracking-tight">
//                 PoolDhaka
//               </p>

//               <p className="text-xs text-slate-500">
//                 Smart Shared Rides
//               </p>

//             </div>

//           </div>


//           {/* Heading */}

//           <div className="mt-16">

//             <p className="text-cyan-400 text-sm font-semibold uppercase tracking-[0.2em]">
//               Dhaka's Shared Ride
//             </p>

//             <h2 className="mt-4 text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight">

//               Share a seat.

//               <br />

//               <span className="text-cyan-400">
//                 Split the fare.
//               </span>

//             </h2>

//             <p className="mt-6 max-w-lg text-slate-400 leading-7">

//               Survive Dhaka traffic with affordable shared rides.
//               Connect with nearby passengers and drivers around
//               Banani, Mohakhali, Gulshan and more.

//             </p>

//           </div>


//           {/* Driver Card */}

//           <div className="mt-12 rounded-2xl bg-slate-800/70 border border-slate-700 p-4">

//             <div className="flex items-center gap-4">

//               <img
//                 src={jashimDriver}
//                 alt="Driver Jashim"
//                 className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400"
//               />

//               <div className="flex-1 min-w-0">

//                 <div className="flex items-center gap-2">

//                   <p className="font-bold text-white">
//                     Jashim
//                   </p>

//                   <span className="w-2 h-2 rounded-full bg-emerald-400" />

//                 </div>

//                 <p className="text-sm text-slate-400 mt-1">
//                   Tesla Model 3 · 4 min away
//                 </p>

//                 <p className="text-xs text-slate-500 mt-1">
//                   2 of 3 seats filled
//                 </p>

//               </div>

//               <div className="text-right">

//                 <p className="text-lg font-black text-cyan-400">
//                   ৳80
//                 </p>

//                 <p className="text-xs text-slate-500">
//                   / seat
//                 </p>

//               </div>

//             </div>

//           </div>


//           {/* Feature Cards */}

//           <div className="grid grid-cols-3 gap-3 mt-8">

//             <div className="rounded-xl bg-slate-800/50 border border-slate-800 p-4">

//               <p className="text-xl font-black text-cyan-400">
//                 01
//               </p>

//               <p className="text-xs text-slate-500 mt-1">
//                 Find a ride
//               </p>

//             </div>


//             <div className="rounded-xl bg-slate-800/50 border border-slate-800 p-4">

//               <p className="text-xl font-black text-cyan-400">
//                 02
//               </p>

//               <p className="text-xs text-slate-500 mt-1">
//                 Share a seat
//               </p>

//             </div>


//             <div className="rounded-xl bg-slate-800/50 border border-slate-800 p-4">

//               <p className="text-xl font-black text-cyan-400">
//                 03
//               </p>

//               <p className="text-xs text-slate-500 mt-1">
//                 Split fare
//               </p>

//             </div>

//           </div>

//         </aside>


//         {/* ========================================= */}
//         {/* RIGHT SIDE */}
//         {/* ========================================= */}

//         <div className="w-full max-w-md mx-auto">


//           {/* Mobile Logo */}

//           <div className="lg:hidden text-center mb-8">

//             <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500 shadow-lg shadow-cyan-500/20">

//               <span className="text-2xl font-black text-slate-950">
//                 T
//               </span>

//             </div>

//             <h1 className="mt-4 text-2xl font-black">
//               PoolDhaka
//             </h1>

//             <p className="text-sm text-slate-500 mt-1">
//               Share a seat. Split the fare.
//             </p>

//           </div>


//           {/* ========================================= */}
//           {/* AUTH CARD */}
//           {/* ========================================= */}

//           <div className="bg-slate-900 border border-slate-800 rounded-[24px] p-5 sm:p-7 shadow-2xl">


//             {/* Header */}

//             <div className="mb-6">

//               <h1 className="text-2xl sm:text-3xl font-black">

//                 {isLogin
//                   ? "Welcome back"
//                   : "Create your account"}

//               </h1>

//               <p className="text-sm text-slate-500 mt-2">

//                 {isLogin
//                   ? "Login to continue your shared ride journey."
//                   : "Join Dhaka Tesla Pool and start sharing rides."}

//               </p>

//             </div>


//             {/* ========================================= */}
//             {/* LOGIN / REGISTER SWITCH */}
//             {/* ========================================= */}

//             <div className="flex bg-slate-800 rounded-xl p-1 mb-6">

//               <button
//                 type="button"
//                 onClick={switchToLogin}
//                 className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
//                   isLogin
//                     ? "bg-cyan-500 text-slate-950 shadow-lg"
//                     : "text-slate-400 hover:text-white"
//                 }`}
//               >
//                 Login
//               </button>


//               <button
//                 type="button"
//                 onClick={switchToRegister}
//                 className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
//                   !isLogin
//                     ? "bg-cyan-500 text-slate-950 shadow-lg"
//                     : "text-slate-400 hover:text-white"
//                 }`}
//               >
//                 Register
//               </button>

//             </div>


//             {/* ========================================= */}
//             {/* ERROR MESSAGE */}
//             {/* ========================================= */}

//             {error && (

//               <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

//                 <p className="text-sm text-red-400">
//                   {error}
//                 </p>

//               </div>

//             )}


//             {/* ========================================= */}
//             {/* SUCCESS MESSAGE */}
//             {/* ========================================= */}

//             {success && (

//               <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">

//                 <p className="text-sm text-emerald-400">
//                   {success}
//                 </p>

//               </div>

//             )}


//             {/* ========================================= */}
//             {/* REGISTER ROLE */}
//             {/* ========================================= */}

//             {!isLogin && (

//               <div className="mb-6">

//                 <label className="block text-sm font-medium text-slate-300 mb-3">
//                   Register as
//                 </label>


//                 <div className="grid grid-cols-2 gap-3">


//                   {/* Passenger */}

//                   <button
//                     type="button"
//                     onClick={() => selectRole("PASSENGER")}
//                     className={`p-4 rounded-xl border text-left transition-all ${
//                       selectedRole === "PASSENGER"
//                         ? "border-cyan-500 bg-cyan-500/10"
//                         : "border-slate-700 bg-slate-800 hover:border-slate-600"
//                     }`}
//                   >

//                     <div className="flex items-center justify-between">

//                       <p
//                         className={`font-bold ${
//                           selectedRole === "PASSENGER"
//                             ? "text-cyan-400"
//                             : "text-white"
//                         }`}
//                       >
//                         Passenger
//                       </p>

//                       {selectedRole === "PASSENGER" && (
//                         <span className="text-cyan-400">
//                           ✓
//                         </span>
//                       )}

//                     </div>

//                     <p className="text-xs text-slate-500 mt-1">
//                       Find shared rides
//                     </p>

//                   </button>


//                   {/* Driver */}

//                   <button
//                     type="button"
//                     onClick={() => selectRole("DRIVER")}
//                     className={`p-4 rounded-xl border text-left transition-all ${
//                       selectedRole === "DRIVER"
//                         ? "border-cyan-500 bg-cyan-500/10"
//                         : "border-slate-700 bg-slate-800 hover:border-slate-600"
//                     }`}
//                   >

//                     <div className="flex items-center justify-between">

//                       <p
//                         className={`font-bold ${
//                           selectedRole === "DRIVER"
//                             ? "text-cyan-400"
//                             : "text-white"
//                         }`}
//                       >
//                         Driver
//                       </p>

//                       {selectedRole === "DRIVER" && (
//                         <span className="text-cyan-400">
//                           ✓
//                         </span>
//                       )}

//                     </div>

//                     <p className="text-xs text-slate-500 mt-1">
//                       Offer shared rides
//                     </p>

//                   </button>

//                 </div>

//               </div>

//             )}


//             {/* ========================================= */}
//             {/* FORM */}
//             {/* ========================================= */}

//             <form
//               onSubmit={handleSubmit(
//                 isLogin
//                   ? handleLogin
//                   : handleRegister
//               )}
//               className="space-y-4"
//             >


//               {/* NAME */}

//               {!isLogin && (

//                 <div>

//                   <label className="block text-sm font-medium text-slate-300 mb-2">
//                     Full Name
//                   </label>

//                   <input
//                     type="text"
//                     placeholder="Enter your name"
//                     {...register("name", {
//                       required: "Name is required",
//                     })}
//                     className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition"
//                   />

//                   {errors.name && (

//                     <p className="text-red-400 text-xs mt-1.5">
//                       {errors.name.message}
//                     </p>

//                   )}

//                 </div>

//               )}


//               {/* EMAIL */}

//               <div>

//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Email Address
//                 </label>

//                 <input
//                   type="email"
//                   placeholder="you@example.com"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value:
//                         /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                       message:
//                         "Enter a valid email",
//                     },
//                   })}
//                   className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition"
//                 />

//                 {errors.email && (

//                   <p className="text-red-400 text-xs mt-1.5">
//                     {errors.email.message}
//                   </p>

//                 )}

//               </div>


//               {/* PASSWORD */}

//               <div>

//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Password
//                 </label>

//                 <input
//                   type="password"
//                   placeholder="Enter your password"
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message:
//                         "Password must be at least 6 characters",
//                     },
//                   })}
//                   className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition"
//                 />

//                 {errors.password && (

//                   <p className="text-red-400 text-xs mt-1.5">
//                     {errors.password.message}
//                   </p>

//                 )}

//               </div>


//               {/* PHONE */}

//               {!isLogin && (

//                 <div>

//                   <label className="block text-sm font-medium text-slate-300 mb-2">
//                     Phone Number
//                   </label>

//                   <input
//                     type="text"
//                     placeholder="01XXXXXXXXX"
//                     {...register("phone", {
//                       required: "Phone is required",
//                     })}
//                     className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition"
//                   />

//                   {errors.phone && (

//                     <p className="text-red-400 text-xs mt-1.5">
//                       {errors.phone.message}
//                     </p>

//                   )}

//                 </div>

//               )}


//               {/* SUBMIT BUTTON */}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3.5 mt-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
//               >

//                 {loading
//                   ? isLogin
//                     ? "Logging in..."
//                     : "Creating account..."
//                   : isLogin
//                   ? "Login"
//                   : "Create Account"}

//               </button>

//             </form>


//             {/* ========================================= */}
//             {/* BOTTOM SWITCH */}
//             {/* ========================================= */}

//             <p className="text-center text-sm text-slate-500 mt-6">

//               {isLogin
//                 ? "Don't have an account?"
//                 : "Already have an account?"}

//               {" "}

//               <button
//                 type="button"
//                 onClick={
//                   isLogin
//                     ? switchToRegister
//                     : switchToLogin
//                 }
//                 className="text-cyan-400 hover:text-cyan-300 font-medium transition"
//               >

//                 {isLogin
//                   ? "Create an account"
//                   : "Login"}

//               </button>

//             </p>

//           </div>


//           {/* Footer */}

//           <p className="text-center text-slate-600 text-xs mt-6">
//             Dhaka Tesla Pool © 2026
//           </p>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default App;


// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";

// import useAuth from "./hooks/useAuth";

// import api from "./api/axios";

// import PassengerDashboard from "./components/Dashboard/PassengerDashboard";
// import DriverDashboard from "./components/Dashboard/DriverDashboard";

// import jashimDriver from "./assets/driver.jpg";

// function App() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [selectedRole, setSelectedRole] = useState("PASSENGER");
//   const [user, setUser] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   // =========================
//   // CHECK EXISTING LOGIN
//   // =========================
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setCheckingAuth(false);
//         return;
//       }

//       try {
//         const response = await api.get("/auth/me", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setUser(response.data.user || response.data);
//       } catch (error) {
//         console.error("Auth check error:", error);
//         localStorage.removeItem("token");
//         setUser(null);
//       } finally {
//         setCheckingAuth(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   // =========================
//   // LOGIN
//   // =========================
//   const handleLogin = async (data) => {
//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");

//       const response = await api.post("/auth/login", {
//         email: data.email,
//         password: data.password,
//       });

//       console.log("Login response:", response.data);

//       const token = response.data.token;

//       if (!token) {
//         throw new Error("Token not received");
//       }

//       localStorage.setItem("token", token);

//       // Get logged-in user
//       const meResponse = await api.get("/auth/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("Current user:", meResponse.data);

//       const loggedInUser = meResponse.data.user || meResponse.data;

//       setUser(loggedInUser);

//       setSuccess("Login successful!");

//       reset();
//     } catch (error) {
//       console.error("Login error:", error);

//       localStorage.removeItem("token");

//       setError(
//         error.response?.data?.message ||
//           error.message ||
//           "Login failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // REGISTER
//   // =========================
//   const handleRegister = async (data) => {
//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");

//       const response = await api.post("/auth/register", {
//         name: data.name,
//         email: data.email,
//         password: data.password,
//         phone: data.phone,
//         role: selectedRole,
//       });

//       console.log("Register response:", response.data);

//       setSuccess(
//         "Account created successfully! Please login."
//       );

//       setIsLogin(true);

//       reset({
//         email: data.email,
//         password: "",
//       });

//       setSelectedRole("PASSENGER");
//     } catch (error) {
//       console.error("Register error:", error);

//       setError(
//         error.response?.data?.message ||
//           error.message ||
//           "Registration failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // LOGOUT
//   // =========================
//   const handleLogout = () => {
//     localStorage.removeItem("token");

//     setUser(null);
//     setIsLogin(true);
//     setSelectedRole("PASSENGER");

//     setError("");
//     setSuccess("");

//     reset();
//   };

//   // =========================
//   // SWITCH LOGIN / REGISTER
//   // =========================
//   const switchToLogin = () => {
//     setIsLogin(true);
//     setError("");
//     setSuccess("");
//     reset();
//   };

//   const switchToRegister = () => {
//     setIsLogin(false);
//     setError("");
//     setSuccess("");
//     setSelectedRole("PASSENGER");
//     reset();
//   };

//   // =========================
//   // SWITCH ROLE
//   // =========================
//   const selectRole = (role) => {
//     setSelectedRole(role);
//     setError("");
//   };

//   // =========================
//   // AUTH CHECK LOADING
//   // =========================
//   if (checkingAuth) {
//     return (
//       <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin mx-auto" />

//           <p className="mt-4 text-slate-400">
//             Checking your session...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // PASSENGER DASHBOARD
//   // =========================
//   if (user?.role === "PASSENGER") {
//     return (
//       <PassengerDashboard
//         user={user}
//         onLogout={handleLogout}
//       />
//     );
//   }

//   // =========================
//   // DRIVER DASHBOARD
//   // =========================
//   if (user?.role === "DRIVER") {
//     return (
//       <DriverDashboard
//         user={user}
//         onLogout={handleLogout}
//       />
//     );
//   }

//   // =========================
//   // AUTH UI
//   // =========================
//   return (
//     <div className="min-h-screen bg-[#f0ece3] flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

//         {/* ========================================= */}
//         {/* LEFT SIDE */}
//         {/* ========================================= */}

//         {/* ===== LEFT DARK PANEL ===== */}
//         <aside className="hidden lg:flex flex-col justify-between rounded-3xl bg-stone-900 text-white p-8 xl:p-10 min-h-[520px] shadow-2xl">

//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow">
//               <span className="text-base font-black text-stone-900">P</span>
//             </div>
//             <p className="text-lg font-black text-white tracking-tight">PoolDhaka</p>
//           </div>

//           {/* Tagline */}
//           <div className="mt-10 flex-1 flex flex-col justify-center">
//             <h2 className="text-4xl xl:text-5xl font-black leading-[1.1] tracking-tight">
//               Share the ride.
//               <br />
//               <span className="text-amber-400">Split the fare.</span>
//             </h2>
//             <p className="mt-5 text-stone-400 leading-relaxed text-sm max-w-xs">
//               Banani, Mohakhali, Gulshan — fair shared rides with drivers you can trust.
//             </p>
//           </div>

//           {/* Driver Preview Card */}
//           <div className="mt-10 rounded-2xl bg-stone-800 border border-stone-700 p-4">
//             <div className="flex items-center gap-3">
//               <img
//                 src={jashimDriver}
//                 alt="Driver Jashim"
//                 className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 flex-shrink-0"
//               />
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-bold text-white">Jashim is 4 min away</p>
//                 <p className="text-xs text-stone-400 mt-0.5">2 of 3 seats filled · ৳80 / seat</p>
//               </div>
//               <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
//             </div>
//           </div>

//         </aside>

//         {/* ========================================= */}
//         {/* RIGHT SIDE */}
//         {/* ========================================= */}

//         <div className="w-full max-w-md mx-auto">

//           {/* Mobile Logo */}
//           <div className="lg:hidden text-center mb-8">
//             <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400 shadow">
//               <span className="text-xl font-black text-stone-900">P</span>
//             </div>
//             <h1 className="mt-3 text-2xl font-black text-stone-900">PoolDhaka</h1>
//             <p className="text-sm text-stone-500 mt-1">Share the ride. Split the fare.</p>
//           </div>

//           {/* AUTH CARD */}
//           <div className="bg-[#faf8f3] border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl">

//             {/* Header */}

//             <div className="mb-6">

//               <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
//                 {isLogin
//                   ? "Welcome back"
//                   : "Create your account"}
//               </h1>

//               <p className="text-sm text-stone-500 mt-1.5">
//                 {isLogin
//                   ? "Log in to continue your ride."
//                   : "Join PoolDhaka and start sharing rides."}
//               </p>

//             </div>

//             {/* LOGIN / REGISTER SWITCH */}
//             <div className="flex bg-stone-100 rounded-xl p-1 mb-5 border border-stone-200">
//               <button
//                 type="button"
//                 onClick={switchToLogin}
//                 className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
//                   isLogin
//                     ? "bg-white text-stone-900 shadow-sm"
//                     : "text-stone-400 hover:text-stone-700"
//                 }`}
//               >
//                 Login
//               </button>
//               <button
//                 type="button"
//                 onClick={switchToRegister}
//                 className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
//                   !isLogin
//                     ? "bg-white text-stone-900 shadow-sm"
//                     : "text-stone-400 hover:text-stone-700"
//                 }`}
//               >
//                 Register
//               </button>
//             </div>

//             {/* ========================================= */}
//             {/* ERROR MESSAGE */}
//             {/* ========================================= */}

//             {error && (
//               <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
//                 <p className="text-sm text-red-600">{error}</p>
//               </div>
//             )}

//             {success && (
//               <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
//                 <p className="text-sm text-emerald-700">{success}</p>
//               </div>
//             )}

//             {/* ========================================= */}
//             {/* REGISTER ROLE */}
//             {/* ========================================= */}

//             {!isLogin && (

//               <div className="mb-5">
//                 <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">
//                   Register as
//                 </label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     onClick={() => selectRole("PASSENGER")}
//                     className={`p-3.5 rounded-xl border text-left transition-all ${
//                       selectedRole === "PASSENGER"
//                         ? "border-orange-400 bg-orange-50 shadow-sm"
//                         : "border-stone-200 bg-white hover:border-stone-300"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <p className={`font-bold text-sm ${
//                         selectedRole === "PASSENGER" ? "text-orange-600" : "text-stone-800"
//                       }`}>
//                         Passenger
//                       </p>
//                       {selectedRole === "PASSENGER" && (
//                         <span className="text-orange-500 font-black">✓</span>
//                       )}
//                     </div>
//                     <p className="text-xs text-stone-400 mt-0.5">Find shared rides</p>
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => selectRole("DRIVER")}
//                     className={`p-3.5 rounded-xl border text-left transition-all ${
//                       selectedRole === "DRIVER"
//                         ? "border-orange-400 bg-orange-50 shadow-sm"
//                         : "border-stone-200 bg-white hover:border-stone-300"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <p className={`font-bold text-sm ${
//                         selectedRole === "DRIVER" ? "text-orange-600" : "text-stone-800"
//                       }`}>
//                         Driver
//                       </p>
//                       {selectedRole === "DRIVER" && (
//                         <span className="text-orange-500 font-black">✓</span>
//                       )}
//                     </div>
//                     <p className="text-xs text-stone-400 mt-0.5">Offer shared rides</p>
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* ========================================= */}
//             {/* FORM */}
//             {/* ========================================= */}

//             <form
//               onSubmit={handleSubmit(
//                 isLogin
//                   ? handleLogin
//                   : handleRegister
//               )}
//               className="space-y-4"
//             >

//               {/* NAME */}
//               {!isLogin && (
//                 <div>
//                   <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter your name"
//                     {...register("name", { required: "Name is required" })}
//                     className="w-full px-4 py-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder:text-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
//                   />
//                   {errors.name && (
//                     <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
//                   )}
//                 </div>
//               )}

//               {/* PHONE OR EMAIL */}
//               <div>
//                 <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
//                   Phone or Email
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="01XXXXXXXXX"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                       message: "Enter a valid email",
//                     },
//                   })}
//                   className="w-full px-4 py-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder:text-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//                 )}
//               </div>

//               {/* PASSWORD */}
//               <div>
//                 <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   placeholder="••••••••"
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Password must be at least 6 characters",
//                     },
//                   })}
//                   className="w-full px-4 py-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder:text-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
//                 />
//                 {errors.password && (
//                   <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
//                 )}
//                 {isLogin && (
//                   <div className="text-right mt-1.5">
//                     <button type="button" className="text-xs text-orange-500 font-semibold hover:text-orange-400 transition">
//                       Forgot password?
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* PHONE */}
//               {!isLogin && (
//                 <div>
//                   <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
//                     Phone Number
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="01XXXXXXXXX"
//                     {...register("phone", { required: "Phone is required" })}
//                     className="w-full px-4 py-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder:text-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
//                   />
//                   {errors.phone && (
//                     <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
//                   )}
//                 </div>
//               )}

//               {/* SUBMIT BUTTON */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-4 mt-1 rounded-2xl bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
//               >
//                 {loading
//                   ? isLogin ? "Logging in..." : "Creating account..."
//                   : isLogin ? "Log in" : "Create Account"}
//               </button>

//             </form>

//             <p className="text-center text-sm text-stone-500 mt-5">
//               {isLogin ? "New to PoolDhaka?" : "Already have an account?"}{" "}
//               <button
//                 type="button"
//                 onClick={
//                   isLogin
//                     ? switchToRegister
//                     : switchToLogin
//                 }
//                 className="text-stone-900 font-bold underline underline-offset-2 hover:text-orange-600 transition"
//               >
//                 {isLogin
//                   ? "Create an account"
//                   : "Login"}
//               </button>
//             </p>

//           </div>

//           <p className="text-center text-stone-400 text-xs mt-5">
//             PoolDhaka © 2026 · Shared rides across Dhaka
//           </p>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default App;


import { useState } from "react";

import { useForm } from "react-hook-form";

import api from "./api/axios";

import useAuth from "./hooks/useAuth";

import PassengerDashboard from "./components/Dashboard/PassengerDashboard";
import DriverDashboard from "./components/Dashboard/DriverDashboard";

import jashimDriver from "./assets/driver.jpg";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState("PASSENGER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    user,
    setUser,
    loading: checkingAuth,
    logout,
  } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      console.log("Login response:", response.data);

      const token = response.data.token;

      if (!token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", token);

      // Get logged-in user
      const meResponse = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Current user:", meResponse.data);

      const loggedInUser =
        meResponse.data.user || meResponse.data;

      setUser(loggedInUser);

      setSuccess("Login successful!");

      reset();
    } catch (error) {
      console.error("Login error:", error);

      localStorage.removeItem("token");

      setUser(null);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: selectedRole,
      });

      console.log("Register response:", response.data);

      setSuccess(
        "Account created successfully! Please login."
      );

      setIsLogin(true);

      reset({
        email: data.email,
        password: "",
      });

      setSelectedRole("PASSENGER");
    } catch (error) {
      console.error("Register error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();

    setIsLogin(true);
    setSelectedRole("PASSENGER");
    setError("");
    setSuccess("");

    reset();
  };

  // =========================
  // SWITCH LOGIN / REGISTER
  // =========================

  const switchToLogin = () => {
    setIsLogin(true);
    setError("");
    setSuccess("");
    reset();
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setError("");
    setSuccess("");
    setSelectedRole("PASSENGER");
    reset();
  };

  // =========================
  // SWITCH ROLE
  // =========================

  const selectRole = (role) => {
    setSelectedRole(role);
    setError("");
  };

  // =========================
  // AUTH CHECK LOADING
  // =========================

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-400">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // PASSENGER DASHBOARD
  // =========================

  if (user?.role === "PASSENGER") {
    return (
      <PassengerDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // =========================
  // DRIVER DASHBOARD
  // =========================

  if (user?.role === "DRIVER") {
    return (
      <DriverDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // =========================
  // AUTH UI
  // =========================

  return (
    <div className="min-h-screen bg-[#f0ece3] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

        {/* =========================
            LEFT DARK PANEL
        ========================= */}

        <aside className="hidden lg:flex flex-col justify-between rounded-3xl bg-stone-900 text-white p-8 xl:p-10 min-h-[520px] shadow-2xl">

          {/* Logo */}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow">
              <span className="text-base font-black text-stone-900">
                P
              </span>
            </div>

            <p className="text-lg font-black text-white tracking-tight">
              PoolDhaka
            </p>
          </div>

          {/* Tagline */}

          <div className="mt-10 flex-1 flex flex-col justify-center">
            <h2 className="text-4xl xl:text-5xl font-black leading-[1.1] tracking-tight">
              Share the ride.
              <br />
              <span className="text-amber-400">
                Split the fare.
              </span>
            </h2>

            <p className="mt-5 text-stone-400 leading-relaxed text-sm max-w-xs">
              Banani, Mohakhali, Gulshan — fair shared rides with drivers you can trust.
            </p>
          </div>

          {/* Driver Preview Card */}

          <div className="mt-10 rounded-2xl bg-stone-800 border border-stone-700 p-4">
            <div className="flex items-center gap-3">
              <img
                src={jashimDriver}
                alt="Driver Jashim"
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">
                  Jashim is 4 min away
                </p>

                <p className="text-xs text-stone-400 mt-0.5">
                  2 of 3 seats filled · ৳80 / seat
                </p>
              </div>

              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
            </div>
          </div>
        </aside>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="w-full max-w-md mx-auto">

          {/* Mobile Logo */}

          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400 shadow">
              <span className="text-xl font-black text-stone-900">
                P
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-black text-stone-900">
              PoolDhaka
            </h1>

            <p className="text-sm text-stone-500 mt-1">
              Share the ride. Split the fare.
            </p>
          </div>

          {/* AUTH CARD */}

          <div className="bg-[#faf8f3] border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl">

            {/* Header */}

            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
                {isLogin
                  ? "Welcome back"
                  : "Create your account"}
              </h1>

              <p className="text-sm text-stone-500 mt-1.5">
                {isLogin
                  ? "Log in to continue your ride."
                  : "Join PoolDhaka and start sharing rides."}
              </p>
            </div>

            {/* LOGIN / REGISTER SWITCH */}

            <div className="flex bg-stone-100 rounded-xl p-1 mb-5 border border-stone-200">

              <button
                type="button"
                onClick={switchToLogin}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isLogin
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={switchToRegister}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  !isLogin
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                Register
              </button>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-sm text-emerald-700">
                  {success}
                </p>
              </div>
            )}

            {/* REGISTER ROLE */}

            {!isLogin && (
              <div className="mb-5">

                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">
                  Register as
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {/* Passenger */}

                  <button
                    type="button"
                    onClick={() =>
                      selectRole("PASSENGER")
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedRole === "PASSENGER"
                        ? "border-orange-400 bg-orange-50 shadow-sm"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">

                      <p
                        className={`font-bold text-sm ${
                          selectedRole === "PASSENGER"
                            ? "text-orange-600"
                            : "text-stone-800"
                        }`}
                      >
                        Passenger
                      </p>

                      {selectedRole === "PASSENGER" && (
                        <span className="text-orange-500 font-black">
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-400 mt-0.5">
                      Find shared rides
                    </p>
                  </button>

                  {/* Driver */}

                  <button
                    type="button"
                    onClick={() =>
                      selectRole("DRIVER")
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedRole === "DRIVER"
                        ? "border-orange-400 bg-orange-50 shadow-sm"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">

                      <p
                        className={`font-bold text-sm ${
                          selectedRole === "DRIVER"
                            ? "text-orange-600"
                            : "text-stone-800"
                        }`}
                      >
                        Driver
                      </p>

                      {selectedRole === "DRIVER" && (
                        <span className="text-orange-500 font-black">
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-400 mt-0.5">
                      Offer shared rides
                    </p>
                  </button>

                </div>
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleSubmit(
                isLogin
                  ? handleLogin
                  : handleRegister
              )}
              className="space-y-4"
            >

              {/* NAME */}

              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    {...register("name", {
                      required: "Name is required",
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder:text-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
                  />

                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}

              {/* EMAIL */}

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder:text-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
                />

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message:
                        "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder:text-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
                />

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}

                {isLogin && (
                  <div className="text-right mt-1.5">
                    <button
                      type="button"
                      className="text-xs text-orange-500 font-semibold hover:text-orange-400 transition"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {/* PHONE */}

              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    placeholder="01XXXXXXXXX"
                    {...register("phone", {
                      required: "Phone is required",
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder:text-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
                  />

                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-1 rounded-2xl bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading
                  ? isLogin
                    ? "Logging in..."
                    : "Creating account..."
                  : isLogin
                  ? "Log in"
                  : "Create Account"}
              </button>

            </form>

            {/* SWITCH */}

            <p className="text-center text-sm text-stone-500 mt-5">
              {isLogin
                ? "New to PoolDhaka?"
                : "Already have an account?"}{" "}

              <button
                type="button"
                onClick={
                  isLogin
                    ? switchToRegister
                    : switchToLogin
                }
                className="text-stone-900 font-bold underline underline-offset-2 hover:text-orange-600 transition"
              >
                {isLogin
                  ? "Create an account"
                  : "Login"}
              </button>
            </p>

          </div>

          <p className="text-center text-stone-400 text-xs mt-5">
            PoolDhaka © 2026 · Shared rides across Dhaka
          </p>

        </div>
      </div>
    </div>
  );
}

export default App;