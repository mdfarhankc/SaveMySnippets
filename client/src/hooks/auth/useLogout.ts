import api from "@/lib/api";
import { useAuthStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface LogoutResponse {
  detail: string;
}

interface LogoutFailResponse {
  refresh_token: string;
}

export const useLogout = () => {
  const { logout, refresh } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    navigate("/sign-in", { replace: true });
    logout();
    queryClient.clear();
    toast.success("Logged out successfully", { id: "logout" });
  };

  return useMutation<LogoutResponse, AxiosError<LogoutFailResponse>>({
    mutationFn: async () => {
      const response = await api.post<LogoutResponse>("/auth/logout/", {
        refresh_token: refresh,
      });
      return response.data;
    },
    onMutate: () => {
      toast.loading("Logging out...", { id: "logout" });
    },
    onSuccess: () => handleLogout(),
    onError: () => handleLogout(),
  });
};
