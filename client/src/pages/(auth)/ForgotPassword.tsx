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
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/validations/auth";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import LoadingButton from "@/components/common/LoadingButton";
import { usePasswordResetRequest } from "@/hooks/auth/usePasswordReset";
import { useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ForgotPasswordPage() {
  usePageTitle("Forgot Password");
  const { mutate: requestReset, isPending } = usePasswordResetRequest();
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordValues) {
    requestReset(values, {
      onSuccess: () => setSubmitted(true),
    });
  }

  return (
    <main className="flex-1 flex">
      <section className="max-w-7xl mx-auto container flex justify-center items-center flex-1">
        <Card className="max-w-xl w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <p className="text-sm text-muted-foreground">
                If an account with that email exists, a password reset link has been sent. Check your inbox.
              </p>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            type="email"
                            placeholder="johndoe@gmail.com"
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
                    Send Reset Link
                  </LoadingButton>
                </form>
              </Form>
            )}
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
