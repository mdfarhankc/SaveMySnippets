import { usePageTitle } from "@/hooks/usePageTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LoadingButton from "@/components/common/LoadingButton";
import BackButton from "@/components/common/BackButton";
import { useGetLanguages } from "@/hooks/languages/useGetLanguages";
import { useCreateLanguage } from "@/hooks/languages/useCreateLanguage";
import { useAuthStore } from "@/store";
import { Navigate } from "react-router";
import { Shield } from "lucide-react";

const createLanguageSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  extension: z.string().min(1, "Extension is required").max(10),
});
type CreateLanguageValues = z.infer<typeof createLanguageSchema>;

export default function AdminDashboardPage() {
  usePageTitle("Admin Dashboard");
  const { authUser } = useAuthStore();
  const { languages, isLoading } = useGetLanguages();
  const createLanguage = useCreateLanguage({
    onSuccess: () => form.reset(),
  });

  const form = useForm<CreateLanguageValues>({
    resolver: zodResolver(createLanguageSchema),
    defaultValues: { name: "", extension: "" },
  });

  if (!authUser?.is_staff) return <Navigate to="/dashboard" />;

  function onSubmit(values: CreateLanguageValues) {
    createLanguage.mutate(values);
  }

  return (
    <main className="flex-1">
      <section className="container max-w-7xl mx-auto py-5 px-3">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Manage languages and settings</p>
          </div>
        </div>
      </section>
      <Separator />
      <section className="container max-w-7xl mx-auto py-8 px-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Language */}
          <Card>
            <CardHeader>
              <CardTitle>Add Language</CardTitle>
              <CardDescription>
                Create a new programming language for snippets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Python"
                            disabled={createLanguage.isPending}
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="extension"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extension</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. py"
                            disabled={createLanguage.isPending}
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <LoadingButton
                    type="submit"
                    className="w-full cursor-pointer"
                    isLoading={createLanguage.isPending}
                  >
                    Add Language
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Existing Languages */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Languages</CardTitle>
              <CardDescription>
                {languages.length} language{languages.length !== 1 && "s"} available
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground text-sm">Loading...</p>
              ) : languages.length === 0 ? (
                <p className="text-muted-foreground text-sm">No languages yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <Badge key={lang.id} variant="secondary" className="text-sm py-1 px-3">
                      {lang.name}
                      <span className="text-muted-foreground ml-1.5">.{lang.extension}</span>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
