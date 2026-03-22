import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { resetPasswordSchema, type ResetPasswordValues } from "@/validations/auth";
import { Input } from "@/components/ui/input";
import { Link, useSearchParams, useNavigate } from "react-router";
import LoadingButton from "@/components/common/LoadingButton";
import { usePasswordResetConfirm } from "@/hooks/auth/usePasswordReset";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ResetPasswordPage() {
  usePageTitle("Reset Password");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const { mutate: confirmReset, isPending } = usePasswordResetConfirm();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm_password: "" },
  });

  function onSubmit(values: ResetPasswordValues) {
    confirmReset(
      { token, password: values.password, confirm_password: values.confirm_password },
      { onSuccess: () => navigate("/sign-in") }
    );
  }

  if (!token) {
    return (
      <main className="flex-1 flex">
        <section className="max-w-7xl mx-auto container flex justify-center items-center flex-1">
          <Card className="max-w-xl w-md">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Invalid Link</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to="/forgot-password" className="text-primary">
                Request a new reset link
              </Link>
            </CardFooter>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 flex">
      <section className="max-w-7xl mx-auto container flex justify-center items-center flex-1">
        <Card className="max-w-xl w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your new password</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <LoadingButton
                  className="w-full cursor-pointer"
                  type="submit"
                  isLoading={isPending}
                >
                  Reset Password
                </LoadingButton>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-center gap-2">
              <span>Remember your password?</span>
              <Link to="/sign-in" className="text-primary">Login</Link>
            </div>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
