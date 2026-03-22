import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { Lanugage } from "@/types";

interface CreateLanguageData {
    name: string;
    extension: string;
}

interface FailResponse {
    [key: string]: string | string[];
}

export const useCreateLanguage = (options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation<Lanugage, AxiosError<FailResponse>, CreateLanguageData>({
        mutationFn: async (values) => {
            const response = await api.post("/snippets/languages/create/", values);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["languages"] });
            toast.success("Language created successfully");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const data = error.response?.data;
            if (data) {
                const messages = Object.values(data).flat();
                messages.forEach((msg) => toast.error(String(msg)));
            } else {
                toast.error("Failed to create language");
            }
        },
    });
};
