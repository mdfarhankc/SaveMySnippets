import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const useDeleteSnippet = (slug?: string) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            await api.delete(`/snippets/${slug}/`);
        },
        onSuccess: () => {
            toast.success("Snippet deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["user-snippets"] });
            queryClient.invalidateQueries({ queryKey: ["snippets"] });
            navigate("/dashboard");
        },
        onError: () => {
            toast.error("Failed to delete snippet");
        },
    });
};
