// import axios from "axios";

// const api = axios.create({
//   baseURL: `${import.meta.env.VITE_API_URL}/api`,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: `https://dhaka-tesla-pool-server-9u5b.onrender.com/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;