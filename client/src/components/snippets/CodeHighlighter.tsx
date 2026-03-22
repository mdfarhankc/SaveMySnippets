import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import type { ClassValue } from "class-variance-authority/types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";

const languageMap: Record<string, string> = {
  py: "python",
  php: "php",
  js: "javascript",
  ts: "typescript",
  html: "html",
  markup: "html",
  yaml: "yaml",
  yml: "yaml",
  json: "json",
  css: "css",
  scss: "scss",
  sql: "sql",
  go: "go",
  sh: "bash",
  md: "markdown",
  rs: "rust",
  java: "java",
  kt: "kotlin",
  rb: "ruby",
  c: "c",
  cpp: "cpp",
  cs: "csharp",
  swift: "swift",
  dart: "dart",
  r: "r",
  lua: "lua",
  docker: "dockerfile",
  tf: "hcl",
  toml: "toml",
  xml: "xml",
  graphql: "graphql",
  jsx: "jsx",
  tsx: "tsx",
};

export default function CodeHighlighter({
  language,
  content,
  showCopyButton = false,
  className = "",
}: {
  language: string;
  content: string;
  showCopyButton?: boolean;
  className?: ClassValue;
}) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState("");

  const shikiLang = languageMap[language] ?? "plaintext";

  useEffect(() => {
    codeToHtml(content, {
      lang: shikiLang,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    }).then(setHtml);
  }, [content, shikiLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  if (!html) {
    return (
      <div className={cn("p-4 bg-muted/30 rounded-md", className)}>
        <pre className="text-sm font-mono whitespace-pre-wrap">{content}</pre>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {showCopyButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="absolute cursor-pointer right-2 top-2 z-10"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      )}
      <div
        className="[&_pre]:!m-0 [&_pre]:p-4 [&_pre]:overflow-auto [&_pre]:text-sm [&_code]:text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
