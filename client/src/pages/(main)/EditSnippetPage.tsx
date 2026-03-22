import { useParams } from "react-router";
import SnippetDetailSkeleton from "@/components/snippets/SnippetDetailSkeleton";
import { useGetSnippetBySlug } from "@/hooks/snippets/useGetSnippetBySlug";
import SnippetForm from "@/components/snippets/SnippetForm";
import BackButton from "@/components/common/BackButton";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function EditSnippetPage() {
  const { slug } = useParams<{ slug: string }>();
  const { snippet, isLoading, isError } = useGetSnippetBySlug(slug!);
  usePageTitle(snippet ? `Edit ${snippet.title}` : "Edit Snippet");

  if (isLoading) return <SnippetDetailSkeleton />;

  if (isError || !snippet) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-destructive">Snippet not found.</p>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section className="container max-w-4xl mx-auto py-5 px-3">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Pencil className="h-6 w-6 text-primary" />
              Edit Snippet
            </h1>
            <p className="text-muted-foreground mt-1">
              Update <span className="font-medium text-foreground">{snippet.title}</span>
            </p>
          </div>
        </div>
      </section>
      <Separator />
      <section className="container max-w-4xl mx-auto py-8 px-3">
        <SnippetForm mode="edit" snippet={snippet} />
      </section>
    </main>
  );
}
