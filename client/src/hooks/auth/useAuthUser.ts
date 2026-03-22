import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { User } from "@/types";
import { useAuthStore } from "@/store";

export const useAuthUser = () => {
    const access = useAuthStore((s) => s.access);

    const { data: authUser, ...query } = useQuery<User>({
        queryKey: ["authUser"],
        queryFn: async () => {
            const response = await api.get<User>("/auth/me/");
            return response.data;
        },
        enabled: !!access,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10,
    });
    return { authUser, ...query };
};
