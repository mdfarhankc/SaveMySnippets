import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";
import { usePageTitle } from "@/hooks/usePageTitle";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";

export default function VerifyEmailPage() {
  usePageTitle("Verify Email");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const { mutate: verify, isPending, isSuccess, isError } = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verify({ token });
    }
  }, [token, verify]);

  return (
    <main className="flex-1 flex">
      <section className="max-w-7xl mx-auto container flex justify-center items-center flex-1 px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              {isPending && (
                <div className="bg-primary/10 p-3 rounded-full">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              )}
              {isSuccess && (
                <div className="bg-green-500/10 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              )}
              {(isError || !token) && (
                <div className="bg-destructive/10 p-3 rounded-full">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {isPending && "Verifying your email..."}
              {isSuccess && "Email verified!"}
              {isError && "Verification failed"}
              {!token && !isPending && !isSuccess && !isError && "Invalid link"}
            </CardTitle>
            <CardDescription className="text-base">
              {isPending && "Please wait while we verify your email address."}
              {isSuccess && "Your account is now active. You can sign in."}
              {isError && "This link may be expired or invalid. Try requesting a new one."}
              {!token && !isPending && !isSuccess && !isError && "This verification link is missing a token."}
            </CardDescription>
          </CardHeader>
          <CardContent />
          <CardFooter className="justify-center border-t pt-4">
            {isSuccess ? (
              <Button asChild>
                <Link to="/sign-in">Sign in to your account</Link>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link to="/sign-in" className="text-primary font-medium hover:underline">
                  Back to sign in
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
