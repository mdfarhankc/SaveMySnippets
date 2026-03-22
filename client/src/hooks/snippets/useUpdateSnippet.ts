import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import type { CreateEditSnippetValues } from "@/validations/snippet";
import { useNavigate } from "react-router";

export const useUpdateSnippet = (slug?: string) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (data: CreateEditSnippetValues) => {
            const res = await api.put(`/snippets/${slug}/`, data);
            return res.data;
        },
        onMutate: () => {
            toast.loading("Saving changes...", { id: "update-snippet" });
        },
        onSuccess: () => {
            toast.success("Snippet updated successfully", { id: "update-snippet" });
            queryClient.invalidateQueries({ queryKey: ["snippet", slug] });
            navigate(-1);
        },
        onError: () => {
            toast.error("Failed to update snippet", { id: "update-snippet" });
        },
    });
};
