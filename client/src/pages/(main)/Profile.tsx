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
import { Separator } from "@/components/ui/separator";
import LoadingButton from "@/components/common/LoadingButton";
import BackButton from "@/components/common/BackButton";
import { useAuthStore } from "@/store";
import { useUpdateProfile } from "@/hooks/auth/useUpdateProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters.").max(20),
  last_name: z.string().min(2, "Last name must be at least 2 characters.").max(20),
});
type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  usePageTitle("Profile");
  const { authUser } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const imageSrc = `https://avatar.iran.liara.run/public?username=${authUser?.full_name}`;

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: authUser?.first_name || "",
      last_name: authUser?.last_name || "",
    },
  });

  function onSubmit(values: ProfileValues) {
    updateProfile(values);
  }

  return (
    <main className="flex-1">
      <section className="container max-w-7xl mx-auto py-5 px-3">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>
        </div>
      </section>
      <Separator />
      <section className="container max-w-7xl mx-auto py-8 px-3">
        <div className="max-w-lg mx-auto space-y-6">
          <Card>
            <CardHeader className="items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={imageSrc} />
                <AvatarFallback className="text-2xl">
                  {authUser?.full_name?.toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-3">{authUser?.full_name}</CardTitle>
              <CardDescription>{authUser?.email}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input disabled={isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input disabled={isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-muted-foreground">Email</FormLabel>
                    <span className="text-sm">{authUser?.email}</span>
                  </div>
                  <LoadingButton
                    className="w-full cursor-pointer"
                    type="submit"
                    isLoading={isPending}
                  >
                    Save Changes
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
