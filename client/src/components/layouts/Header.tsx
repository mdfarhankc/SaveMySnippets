import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import Logo from "@/components/common/Logo";
import UserButton from "@/components/common/UserButton";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "Explore", url: "/explore" },
  { name: "Contact", url: "/contact" },
];

export default function Header() {
  const { authUser } = useAuthStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.url}
              to={link.url}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === link.url
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {authUser ? (
            <UserButton />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          {authUser && <UserButton />}
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.url}
                to={link.url}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.url
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
            {!authUser && (
              <div className="flex flex-col gap-2 pt-2 border-t mt-2">
                <Button variant="outline" asChild onClick={() => setMobileOpen(false)}>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button asChild onClick={() => setMobileOpen(false)}>
                  <Link to="/sign-up">Get Started</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
