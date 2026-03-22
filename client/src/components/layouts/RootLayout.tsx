import { Outlet } from "react-router";
import Header from "./Header";
import { Toaster } from "../ui/sonner";
import { useAuthUser } from "@/hooks/auth/useAuthUser";
import { useEffect } from "react";
import { useAuthStore } from "@/store";

export default function RootLayout() {
  const access = useAuthStore((s) => s.access);
  const { authUser, isError } = useAuthUser();
  const { setAuthUser, logout } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      setAuthUser(authUser);
    }
    if (isError && access) {
      logout();
    }
  }, [isError, authUser, setAuthUser, logout, access]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Toaster richColors />
    </div>
  );
}
