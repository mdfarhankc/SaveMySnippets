import api from "@/lib/api";
import type { RegisterValues } from "@/validations/auth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface RegisterResponse {
    detail: string;
}

interface RegisterFailResponse {
    [key: string]: string | string[];
}

export const useRegister = () => {
    return useMutation<RegisterResponse, AxiosError<RegisterFailResponse>, RegisterValues>(
        {
            mutationFn: async (values: RegisterValues) => {
                const response = await api.post("/auth/register/", values);
                return response.data;
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
