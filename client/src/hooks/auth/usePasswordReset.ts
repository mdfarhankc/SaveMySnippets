import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface FailResponse {
    detail?: string;
    email?: string[];
}

export const usePasswordResetRequest = () => {
    return useMutation<{ detail: string }, AxiosError<FailResponse>, { email: string }>({
        mutationFn: async (values) => {
            const response = await api.post("/auth/password-reset/", values);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.detail || "Password reset email sent.");
        },
        onError: (error) => {
            const data = error.response?.data;
            const message = data?.detail || data?.email?.[0] || "Something went wrong.";
            toast.error(message);
        },
    });
};

export const usePasswordResetConfirm = () => {
    return useMutation<
        { detail: string },
        AxiosError<FailResponse>,
        { token: string; password: string; confirm_password: string }
    >({
        mutationFn: async (values) => {
            const response = await api.post("/auth/password-reset-confirm/", values);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.detail || "Password reset successful.");
        },
        onError: (error) => {
            const message = error.response?.data?.detail || "Something went wrong.";
            toast.error(message);
        },
    });
};
