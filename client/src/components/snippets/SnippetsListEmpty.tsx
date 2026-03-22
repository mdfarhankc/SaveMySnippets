import { Code2Icon, Plus } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function SnippetsListEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Code2Icon />
        </EmptyMedia>
        <EmptyTitle>No Snippets Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any snippets yet. Get started by creating
          your first snippet.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link to="/snippet/new">
            <Plus className="h-4 w-4 mr-2" />
            New Snippet
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
