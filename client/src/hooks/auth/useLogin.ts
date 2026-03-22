import api from "@/lib/api";
import { useAuthStore } from "@/store";
import type { User } from "@/types";
import type { LoginValues } from "@/validations/auth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

interface LoginFailResponse {
  detail: string;
}

export const useLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation<LoginResponse, AxiosError<LoginFailResponse>, LoginValues>(
    {
      mutationFn: async (values: LoginValues) => {
        const response = await api.post("/auth/login/", values);
        return response.data;
      },
      onSuccess: (data) => {
        login({
          access: data.access,
          refresh: data.refresh,
          authUser: data.user,
        });
        toast.success("Logged in successfully");
        navigate('/dashboard');
      },
      onError: (error) => {
        if (error.code === "ERR_NETWORK") {
          toast.error("Could not connect to server");
          return;
        }
        const message =
          error.response?.data?.detail || "Login failed. Please try again.";
        toast.error(message);
      },
    }
  );
};
