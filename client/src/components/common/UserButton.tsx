import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/auth/useLogout";
import { LayoutDashboard, LogOut, Shield, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store";
import { Link } from "react-router";

export default function UserButton() {
  const { mutate: logout } = useLogout();
  const { authUser } = useAuthStore();
  const displayName = authUser?.full_name || authUser?.email || "User";
  const initials = (authUser?.full_name || authUser?.email || "U").toUpperCase().slice(0, 2);
  const imageSrc = `https://avatar.iran.liara.run/public?username=${displayName}`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar>
          <AvatarImage src={imageSrc} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link to={"/dashboard"}>
              <LayoutDashboard className="w-6 h-6" /> Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link to={"/profile"}>
              <User className="w-6 h-6" /> Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {authUser?.is_staff && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/admin">
                  <Shield className="w-6 h-6" /> Admin Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
          <LogOut className="w-6 h-6" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
