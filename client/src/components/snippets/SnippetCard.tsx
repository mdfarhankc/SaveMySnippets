import { format } from "date-fns";
import type { Snippet } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Eye, Lock } from "lucide-react";
import { Link } from "react-router";
import CodeHighlighter from "./CodeHighlighter";

export default function SnippetCard({ snippet }: { snippet: Snippet }) {

  const language = snippet.language.extension.replace(".", "");
  const snippetDetailLink = `/snippet/${snippet.slug}`;

  return (
    <Link to={snippetDetailLink} className="group">
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardHeader className="pb-3 min-h-[100px] flex flex-col justify-between">
          <div className="flex justify-between items-start w-full">
            <div className="flex-1">
              <CardTitle className="line-clamp-1 text-base sm:text-lg group-hover:text-primary transition-colors">
                {snippet.title}
              </CardTitle>
              <p className="text-muted-foreground mt-1 text-sm line-clamp-2 min-h-10">
                {snippet.description || (
                  <span className="invisible">No description</span>
                )}
              </p>
            </div>
            <Badge
              variant={snippet.is_public ? "success" : "destructive"}
              className="ml-2"
            >
              {snippet.is_public ? (
                <Eye className="h-3 w-3 mr-1" />
              ) : (
                <Lock className="h-3 w-3 mr-1" />
              )}
              {snippet.is_public ? "Public" : "Private"}
            </Badge>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3 min-h-5">
            {snippet.tags.length > 0 ? (
              <>
                {snippet.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index}>{tag}</Badge>
                ))}
                {snippet.tags.length > 3 && (
                  <Badge variant="success">+{snippet.tags.length - 3} more</Badge>
                )}
              </>
            ) : (
              <div className="invisible">No tags</div>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative overflow-hidden max-h-48 flex-1">
          <CodeHighlighter
            language={language}
            content={snippet.content}
            className={"code-highlighter"}
          />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent pointer-events-none" />
        </CardContent>
        <CardFooter className="mt-auto text-sm text-muted-foreground flex items-center justify-between border-t">
          <div className="flex flex-col">
            <span>
              Last updated: {format(new Date(snippet.updated_at), "PPP")}
            </span>
            <span className="text-xs text-muted-foreground">
              Created by: <span className="font-bold">{snippet.created_by}</span>
            </span>
          </div>

          <Badge variant="secondary" className="uppercase">
            {snippet.language.name}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
