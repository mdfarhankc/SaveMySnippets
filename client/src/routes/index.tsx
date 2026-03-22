import { createBrowserRouter } from "react-router";
import RootLayout from "@/components/layouts/RootLayout";
import HomePage from "@/pages/Home";
import AuthLayout from "@/components/layouts/AuthLayout";
import LoginPage from "@/pages/(auth)/Login";
import RegisterPage from "@/pages/(auth)/Register";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import DashboardPage from "@/pages/(main)/Dashboard";
import SnippetDetailPage from "@/pages/(main)/SnippetDetail";
import ExplorePage from "@/pages/(root)/Explore";
import ContactPage from "@/pages/(root)/Contact";
import EditSnippetPage from "@/pages/(main)/EditSnippetPage";
import ForgotPasswordPage from "@/pages/(auth)/ForgotPassword";
import ResetPasswordPage from "@/pages/(auth)/ResetPassword";
import ProfilePage from "@/pages/(main)/Profile";
import CreateSnippetPage from "@/pages/(main)/CreateSnippetPage";
import AdminDashboardPage from "@/pages/(main)/AdminDashboard";
import NotFoundPage from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Home
      {
        index: true,
        element: <HomePage />,
      },
      // Explore
      {
        path: "/explore",
        element: <ExplorePage />,
      },
      // Contact
      {
        path: "/contact",
        element: <ContactPage />,
      },
      // Public snippet detail (accessible without auth)
      {
        path: "/snippet/:slug",
        element: <SnippetDetailPage />,
      },
      //   Auth Pages
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/sign-in",
            element: <LoginPage />,
          },
          {
            path: "/sign-up",
            element: <RegisterPage />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "/reset-password",
            element: <ResetPasswordPage />,
          },
        ],
      },
      //   Protected Pages
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/snippet/new",
            element: <CreateSnippetPage />,
          },
          {
            path: "/snippet/:slug/edit",
            element: <EditSnippetPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/admin",
            element: <AdminDashboardPage />,
          },
        ],
      },
      // 404
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
