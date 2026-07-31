import axios from "axios";
import API_URL from "../config";

const API = axios.create({
    baseURL: `${API_URL}/api/auth`,
});

export const verifyOtpRequest = (email, otp) =>
    API.post("/verify-otp", { email, otp });

export const resendOtpRequest = (email) =>
    API.post("/resend-otp", { email });