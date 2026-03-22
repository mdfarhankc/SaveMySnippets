import api from "@/lib/api";
import { useAuthStore } from "@/store";
import type { User } from "@/types";
import type { RegisterValues } from "@/validations/auth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface RegisterResponse {
    access: string;
    refresh: string;
    user: User;
}

interface RegisterFailResponse {
    [key: string]: string | string[];
}

export const useRegister = () => {
    const { login } = useAuthStore();
    const navigate = useNavigate();

    return useMutation<RegisterResponse, AxiosError<RegisterFailResponse>, RegisterValues>(
        {
            mutationFn: async (values: RegisterValues) => {
                const response = await api.post("/auth/register/", values);
                return response.data;
            },
            onSuccess: (data) => {
                login({
                    access: data.access,
                    refresh: data.refresh,
                    authUser: data.user,
                });
                toast.success("Account created successfully");
                navigate('/dashboard');
            },
            onError: (error) => {
                if (error.code === "ERR_NETWORK") {
                    toast.error("Could not connect to server");
                    return;
                }
                const data = error.response?.data;
                if (data) {
                    const messages = Object.values(data).flat();
                    messages.forEach((msg) => toast.error(String(msg)));
                } else {
                    toast.error("Registration failed, please try again");
                }
            },
        }
    );
};
