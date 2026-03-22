import api from "@/lib/api"
import type { Snippet } from "@/types";
import type { CreateEditSnippetValues } from "@/validations/snippet";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface FailResponse {
    detail: string;
}


export const useCreateSnippets = (options?: {
    onSuccess?: () => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation<Snippet, AxiosError<FailResponse>, CreateEditSnippetValues>({
        mutationFn: async (values: CreateEditSnippetValues) => {
            const response = await api.post('/snippets/', values);
            return response.data;
        },
        onMutate: () => {
            toast.loading("Creating snippet...", { id: "create-snippet" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-snippets"] });
            toast.success("Snippet created successfully", { id: "create-snippet" });
            options?.onSuccess?.();
        },
        onError: (error) => {
            const message = error?.response?.data?.detail || "Something went wrong";
            toast.error(message, { id: "create-snippet" });
        },
    })
}
