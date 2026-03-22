import { usePageTitle } from "@/hooks/usePageTitle";
import Footer from "@/components/layouts/Footer";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import {
  ArrowRight,
  Code,
  Globe,
  LockKeyhole,
  Save,
  Search,
  Sparkles,
  Tags,
} from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeroImage from "@/assets/hero.png";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Save,
    title: "Save & Organize",
    text: "Store all your code snippets in one place with powerful organization tools.",
  },
  {
    icon: Tags,
    title: "Tag & Categorize",
    text: "Add tags and categories to make your snippets easy to find when you need them.",
  },
  {
    icon: Search,
    title: "Search & Find",
    text: "Powerful search functionality helps you find the exact snippet you need, fast.",
  },
  {
    icon: Code,
    title: "Syntax Highlighting",
    text: "Beautiful syntax highlighting for all major programming languages.",
  },
  {
    icon: Globe,
    title: "Share & Collaborate",
    text: "Share your snippets with others or keep them private — you decide.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Storage",
    text: "Your code is safely stored with proper authentication and authorization.",
  },
];

export default function HomePage() {
  usePageTitle();
  const { authUser } = useAuthStore();

  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="container relative max-w-6xl mx-auto px-6 py-24 md:py-36">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-16 text-center lg:text-left">
              <div className="flex-1 space-y-8">
                <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Free and open source
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                  Organize your{" "}
                  <span className="text-primary">code snippets</span>{" "}
                  effortlessly
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Store, manage, and share your code snippets in one place.
                  Built for developers who value clean, accessible code.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  {authUser ? (
                    <>
                      <Button size="lg" asChild>
                        <Link to="/dashboard">
                          Go to Dashboard
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/explore">Explore Snippets</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="lg" asChild>
                        <Link to="/sign-up">
                          Get Started
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/explore">Explore Snippets</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-1 hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl" />
                  <img
                    src={HeroImage}
                    alt="Organize Code Snippets"
                    className="relative w-full h-auto rounded-xl border border-border/50 shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 border-t">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                Features
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Everything you need to organize your code
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A simple yet powerful toolkit designed to help you save, find, and share code snippets.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, text }, i) => (
                <Card
                  key={i}
                  className="group border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5"
                >
                  <CardHeader>
                    <div className="bg-primary/10 w-11 h-11 flex items-center justify-center rounded-lg mb-3 group-hover:bg-primary/15 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 border-t">
          <div className="container max-w-3xl mx-auto text-center">
            <div className="relative rounded-2xl border border-border/50 bg-muted/50 p-12 md:p-16 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
              <div className="relative space-y-6">
                <div className="flex justify-center">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Code className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Start organizing your code today
                </h2>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                  Join developers who use SaveMySnippet to keep their code snippets organized and accessible.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button size="lg" asChild>
                    <Link to="/sign-up">
                      Sign up for free
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/explore">Browse snippets</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
