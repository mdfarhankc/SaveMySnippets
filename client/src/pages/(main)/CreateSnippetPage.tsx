import SnippetForm from "@/components/snippets/SnippetForm";
import BackButton from "@/components/common/BackButton";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function CreateSnippetPage() {
  usePageTitle("New Snippet");
  return (
    <main className="flex-1">
      <section className="container max-w-4xl mx-auto py-5 px-3">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Plus className="h-7 w-7 text-primary" />
              New Snippet
            </h1>
            <p className="text-muted-foreground mt-1">
              Paste your code and organize it with tags and a language.
            </p>
          </div>
        </div>
      </section>
      <Separator />
      <section className="container max-w-4xl mx-auto py-8 px-3">
        <SnippetForm mode="create" />
      </section>
    </main>
  );
}
