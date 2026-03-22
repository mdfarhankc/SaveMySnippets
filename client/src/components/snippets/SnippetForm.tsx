import LanguageSelector from "../languages/LanguageSelector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "../common/LoadingButton";
import {
  createEditSnippetSchema,
  type CreateEditSnippetValues,
} from "@/validations/snippet";
import { useCreateSnippets } from "@/hooks/snippets/useCreateSnippets";
import { useUpdateSnippet } from "@/hooks/snippets/useUpdateSnippet";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Code, Globe, Save, Tags, X } from "lucide-react";
import type { Snippet } from "@/types";
import AutoResizeTextarea from "../ui/AutoResizeTextarea";
import { useNavigate } from "react-router";

interface SnippetFormProps {
  mode: "create" | "edit";
  snippet?: Snippet;
}

export default function SnippetForm({ mode, snippet }: SnippetFormProps) {
  const [tagsInput, setTagsInput] = useState("");
  const navigate = useNavigate();

  const form = useForm<CreateEditSnippetValues>({
    resolver: zodResolver(createEditSnippetSchema),
    defaultValues: {
      title: snippet?.title || "",
      description: snippet?.description || "",
      content: snippet?.content || "",
      language: snippet?.language.id || "",
      is_public: snippet?.is_public || false,
      tags: snippet?.tags || [],
    },
  });

  useEffect(() => {
    if (snippet) {
      setTagsInput(snippet.tags.join(", "));
    }
  }, [snippet]);

  const createMutation = useCreateSnippets({
    onSuccess: () => navigate("/dashboard"),
  });
  const updateMutation = useUpdateSnippet(snippet?.slug);

  const onSubmit = (values: CreateEditSnippetValues) => {
    if (mode === "create") {
      createMutation.mutate(values);
    } else {
      updateMutation.mutate(values);
    }
  };

  const removeTag = (tagToRemove: string, field: ControllerRenderProps<CreateEditSnippetValues, "tags">) => {
    const updatedTags =
      field.value?.filter((tag: string) => tag !== tagToRemove) || [];
    field.onChange(updatedTags);
    setTagsInput(updatedTags.join(", "));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Details card */}
        <Card className="border-border/50 gap-0 py-0">
          <CardHeader className="py-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Save className="h-4 w-4 text-primary" />
              Details
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Django Custom User Model..."
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                      <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="A brief description..."
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings card */}
        <Card className="border-border/50 gap-0 py-0">
          <CardHeader className="py-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              Settings
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                name="language"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <LanguageSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="is_public"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      Visibility
                    </FormLabel>
                    <div className="flex items-center gap-3 h-10">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <span className="text-sm text-muted-foreground">
                        {field.value ? "Public — anyone can view" : "Private — only you can view"}
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Tags className="h-3.5 w-3.5" />
                    Tags
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="Comma-separated (e.g., auth, react, api)"
                        value={tagsInput}
                        className="h-10"
                        disabled={isPending}
                        onChange={(e) => {
                          const raw = e.target.value;
                          setTagsInput(raw);
                          const tagsArray = raw
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter((tag) => tag.length > 0);
                          field.onChange(tagsArray);
                        }}
                      />
                      {field.value && field.value.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {field.value.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1 pr-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag, field)}
                                className="ml-0.5 hover:bg-muted rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Code card */}
        <Card className="border-border/50 gap-0 py-0">
          <CardHeader className="py-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              Code
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="py-4">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AutoResizeTextarea
                      {...field}
                      disabled={isPending}
                      placeholder="Paste your code here..."
                      className="min-h-[300px] font-mono text-sm bg-muted/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <LoadingButton
            type="submit"
            className="cursor-pointer px-8"
            isLoading={isPending}
          >
            {mode === "create" ? "Create Snippet" : "Save Changes"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
