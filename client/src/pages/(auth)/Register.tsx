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
import { registerSchema, type RegisterValues } from "@/validations/auth";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import LoadingButton from "@/components/common/LoadingButton";
import { useRegister } from "@/hooks/auth/useRegister";
import { useResendVerification } from "@/hooks/auth/useVerifyEmail";
import { Code, Mail, UserPlus } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  usePageTitle("Sign Up");
  const { mutate: register, isPending, isSuccess } = useRegister();
  const { mutate: resend, isPending: isResending } = useResendVerification();
  const [registeredEmail, setRegisteredEmail] = useState("");

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  function onSubmit(values: RegisterValues) {
    setRegisteredEmail(values.email);
    register(values);
  }

  if (isSuccess) {
    return (
      <main className="flex-1 flex">
        <section className="max-w-7xl mx-auto container flex justify-center items-center flex-1 px-4">
          <Card className="w-full max-w-md border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
              <CardDescription className="text-base">
                We've sent a verification link to{" "}
                <span className="font-medium text-foreground">{registeredEmail}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the link in the email to verify your account. The link expires in 24 hours.
              </p>
              <Button
                variant="outline"
                size="sm"
                disabled={isResending}
                onClick={() => resend({ email: registeredEmail })}
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>
            </CardContent>
            <CardFooter className="justify-center border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Already verified?{" "}
                <Link to="/sign-in" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 flex">
      <section className="max-w-7xl mx-auto container flex justify-center items-center flex-1 px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg gap-4">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <Code className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription className="text-base">
              Get started with SaveMySnippets for free
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="John"
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
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="Doe"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="password"
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
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="password"
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <LoadingButton
                  className="w-full cursor-pointer h-10 mt-2"
                  type="submit"
                  isLoading={isPending}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </LoadingButton>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
