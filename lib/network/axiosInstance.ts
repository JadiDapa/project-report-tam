import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_API_URL,
});
