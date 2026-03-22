import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { Link } from "react-router";

export default function NotFoundPage() {
  usePageTitle("Page Not Found");
  return (
    <main className="flex-1 flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-muted p-4 rounded-full">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <p className="text-lg text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/explore">Explore Snippets</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
