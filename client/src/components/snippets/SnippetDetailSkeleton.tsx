import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export default function SnippetDetailSkeleton() {
  return (
    <main className="flex-1">
      <section className="max-w-4xl mx-auto py-8 px-3 space-y-6">
        {/* Back + actions */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <Skeleton className="h-9 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>

        {/* Description */}
        <Skeleton className="h-5 w-full" />

        {/* Code */}
        <Card className="overflow-hidden border-border/50 py-0 gap-0">
          <CardContent className="p-0">
            <Skeleton className="h-72 w-full rounded-none" />
          </CardContent>
        </Card>

        {/* Meta */}
        <Separator />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-40" />
        </div>
      </section>
    </main>
  );
}
