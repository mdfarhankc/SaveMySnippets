import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface VerifyResponse {
    detail: string;
}

interface FailResponse {
    detail?: string;
}

export const useVerifyEmail = () => {
    return useMutation<VerifyResponse, AxiosError<FailResponse>, { token: string }>({
        mutationFn: async (values) => {
            const response = await api.post("/auth/verify-email/", values);
            return response.data;
        },
        onError: (error) => {
            const message = error.response?.data?.detail || "Verification failed";
            toast.error(message);
        },
    });
};

export const useResendVerification = () => {
    return useMutation<VerifyResponse, AxiosError<FailResponse>, { email: string }>({
        mutationFn: async (values) => {
            const response = await api.post("/auth/resend-verification/", values);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.detail || "Verification email sent");
        },
        onError: (error) => {
            const message = error.response?.data?.detail || "Something went wrong";
            toast.error(message);
        },
    });
};
