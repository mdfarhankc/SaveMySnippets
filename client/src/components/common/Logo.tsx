import { cn } from "@/lib/utils";
import type { ClassValue } from "class-variance-authority/types";
import { Code } from "lucide-react";
import { Link } from "react-router";

export default function Logo({
  className = "",
  iconClassName = "",
}: {
  className?: ClassValue;
  iconClassName?: ClassValue;
}) {
  return (
    <Link
      to={"/"}
      className={cn("flex items-center gap-2 text-xl font-bold", className)}
    >
      <Code className={cn("h-6 w-6 text-primary", iconClassName)} />
      <h1>SaveMySnippets</h1>
    </Link>
  );
}
