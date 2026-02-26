import axios from "axios";

export const getAxiosInstance = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};