import { useAuthStore } from "@/store";
import { Navigate, Outlet } from "react-router";

export default function ProtectedLayout() {
  const { authUser, access } = useAuthStore();

  if (!authUser || !access) return <Navigate to="/sign-in" />;
  return <Outlet />;
}
