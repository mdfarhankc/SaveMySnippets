import BackButton from "@/components/common/BackButton";
import CodeHighlighter from "@/components/snippets/CodeHighlighter";
import SnippetDetailSkeleton from "@/components/snippets/SnippetDetailSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetSnippetBySlug } from "@/hooks/snippets/useGetSnippetBySlug";
import { useDeleteSnippet } from "@/hooks/snippets/useDeleteSnippet";
import { useCreateSnippets } from "@/hooks/snippets/useCreateSnippets";
import { useAuthStore } from "@/store";
import {
  Calendar,
  Clock,
  Code,
  Copy,
  Download,
  Eye,
  Lock,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useState } from "react";
import { format } from "date-fns";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function SnippetDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { snippet, isLoading, isError } = useGetSnippetBySlug(slug!);
  const { mutate: deleteSnippet, isPending: isDeleting } = useDeleteSnippet(slug);
  const duplicateMutation = useCreateSnippets({
    onSuccess: () => navigate("/dashboard"),
  });
  const { authUser } = useAuthStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  usePageTitle(snippet?.title);

  const isOwner = snippet && authUser && snippet.user_id === authUser.id;

  const handleDuplicate = () => {
    if (!snippet) return;
    duplicateMutation.mutate({
      title: `${snippet.title} (copy)`,
      description: snippet.description,
      content: snippet.content,
      language: snippet.language.id,
      is_public: false,
      tags: snippet.tags,
    });
  };

  const handleDownload = () => {
    if (!snippet) return;
    const ext = snippet.language.extension.startsWith(".")
      ? snippet.language.extension
      : `.${snippet.language.extension}`;
    const filename = `${snippet.slug}${ext}`;
    const blob = new Blob([snippet.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      <section className="max-w-4xl mx-auto py-8 px-3 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <BackButton />
            <div className="flex gap-2 flex-wrap justify-end">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download
              </Button>
              {authUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicate}
                  disabled={duplicateMutation.isPending}
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  {duplicateMutation.isPending ? "Duplicating..." : "Duplicate"}
                </Button>
              )}
              {isOwner && (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/snippet/${snippet.slug}/edit`}>
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Link>
                  </Button>
                  {showDeleteConfirm ? (
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-muted-foreground">Sure?</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => deleteSnippet()}
                      >
                        {isDeleting ? "Deleting..." : "Yes, delete"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Title + badges */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">{snippet.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={snippet.is_public ? "success" : "destructive"}>
                {snippet.is_public ? (
                  <Eye className="h-3 w-3 mr-1" />
                ) : (
                  <Lock className="h-3 w-3 mr-1" />
                )}
                {snippet.is_public ? "Public" : "Private"}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Code className="h-3 w-3" />
                {snippet.language.name}
              </Badge>
              {snippet.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {snippet.description && (
          <p className="text-muted-foreground leading-relaxed">
            {snippet.description}
          </p>
        )}

        {/* Code */}
        <Card className="overflow-hidden border-border/50 py-0 gap-0">
          <CardContent className="p-0">
            <CodeHighlighter
              language={snippet.language.extension.replace(".", "")}
              content={snippet.content}
              showCopyButton={true}
            />
          </CardContent>
        </Card>

        {/* Meta info */}
        <Separator />
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {snippet.created_by || "Anonymous"}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Created {format(new Date(snippet.created_at), "PPP")}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Updated {format(new Date(snippet.updated_at), "PPP")}
          </span>
        </div>
      </section>
    </main>
  );
}
