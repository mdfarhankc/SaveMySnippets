import { useInfiniteQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { PaginatedResponse, Snippet } from "@/types";

const LIMIT = 20;

export interface SnippetFilters {
    search?: string;
    ordering?: string;
    language?: string;
    tag?: string;
}

export const useGetPublicSnippets = (filters: SnippetFilters = {}) => {
    return useInfiniteQuery<PaginatedResponse<Snippet>>({
        queryKey: ["snippets", filters],
        queryFn: async ({ pageParam = 0 }) => {
            const params = new URLSearchParams();
            params.set("limit", String(LIMIT));
            params.set("offset", String(pageParam));
            if (filters.search) params.set("search", filters.search);
            if (filters.ordering) params.set("ordering", filters.ordering);
            if (filters.language) params.set("language__name", filters.language);
            if (filters.tag) params.set("tags__name", filters.tag);

            const response = await api.get<PaginatedResponse<Snippet>>(
                `/snippets/?${params.toString()}`
            );
            return response.data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage.next) return undefined;

            const url = new URL(lastPage.next);
            return Number(url.searchParams.get("offset"));
        },
    });
}
