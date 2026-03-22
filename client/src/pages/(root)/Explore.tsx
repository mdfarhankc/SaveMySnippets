import SnippetCard from "@/components/snippets/SnippetCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublicSnippets } from "@/hooks/snippets/useGetPublicSnippets";
import { useGetLanguages } from "@/hooks/languages/useGetLanguages";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";

const SORT_OPTIONS = [
  { label: "Newest", value: "-created_at" },
  { label: "Oldest", value: "created_at" },
  { label: "Recently updated", value: "-updated_at" },
  { label: "Title A-Z", value: "title" },
  { label: "Title Z-A", value: "-title" },
];

export default function ExplorePage() {
  usePageTitle("Explore");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [language, setLanguage] = useState("");
  const { languages } = useGetLanguages();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPublicSnippets({
      search: debouncedSearch,
      ordering,
      language: language || undefined,
    });
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const snippets = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <main className="flex-1">
      <section className="container max-w-7xl mx-auto py-5 px-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Explore snippets
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm cursor-pointer"
          >
            <option value="">All Languages</option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.name}>{lang.name}</option>
            ))}
          </select>
        </div>
      </section>
      <Separator />
      <section className="container max-w-7xl mx-auto py-5 px-3">
        <ScrollArea>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-3/5" />
                    <Skeleton className="h-8 w-1/4" />
                  </div>
                  <Skeleton className="h-40 w-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-1/5" />
                  </div>
                </Card>
              ))}
            </div>
          ) : snippets.length === 0 ? (
            <p className="text-muted-foreground">
              {debouncedSearch || language
                ? "No snippets match your filters."
                : "No public snippets available."}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {snippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
              </div>
              <div ref={loadMoreRef} className="h-10" />
              {isFetchingNextPage && (
                <p className="text-center text-muted-foreground mt-4">
                  Loading more…
                </p>
              )}
            </>
          )}
        </ScrollArea>
      </section>
    </main>
  );
}
