import { useMemo } from "react";
import axios from "axios";

const useAxiosSecure = () => {
  const axiosSecure = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:5000/api",
    });

    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  return axiosSecure;
};

export default useAxiosSecure;