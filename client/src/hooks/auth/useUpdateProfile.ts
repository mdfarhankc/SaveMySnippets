import api from "@/lib/api";
import { useAuthStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { User } from "@/types";

interface UpdateProfileData {
    first_name: string;
    last_name: string;
}

export const useUpdateProfile = () => {
    const { setAuthUser } = useAuthStore();

    return useMutation<User, AxiosError, UpdateProfileData>({
        mutationFn: async (values) => {
            const response = await api.patch<User>("/auth/me/", values);
            return response.data;
        },
        onSuccess: (data) => {
            setAuthUser(data);
            toast.success("Profile updated successfully");
        },
        onError: () => {
            toast.error("Failed to update profile");
        },
    });
};
