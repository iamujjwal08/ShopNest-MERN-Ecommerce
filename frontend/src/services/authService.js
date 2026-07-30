import axios from "axios";

const API = axios.create({
    baseURL: "/api/auth",
});

export const verifyOtpRequest = (email, otp) =>
    API.post("/verify-otp", { email, otp });

export const resendOtpRequest = (email) =>
    API.post("/resend-otp", { email });