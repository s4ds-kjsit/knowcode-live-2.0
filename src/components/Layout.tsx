import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Award, BarChart3, Home, Upload, Menu, X, LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, loading] = useAuthState(auth);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Submit Project", href: "/submit", icon: Upload },
    { name: "Judge Projects", href: "/judge", icon: Award },
    { name: "Reports", href: "/reports", icon: BarChart3 },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!user) {
    navigate("/"); // Redirect to login page if not authenticated
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Judgehack</h1>
        <div className="flex items-center space-x-4">
          <nav className="hidden lg:flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm",
                  location.pathname === item.href
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 bg-red-500 px-3 py-2 rounded-md text-sm hover:bg-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <button
            className="lg:hidden block text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <nav className="lg:hidden bg-gray-800 text-white p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-sm mb-2",
                location.pathname === item.href
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              )}
              onClick={toggleMobileMenu}
            >
              <item.icon className="w-4 h-4 inline-block mr-2" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 px-3 py-2 rounded-md text-sm hover:bg-red-600"
          >
            <LogOut className="w-4 h-4 inline-block mr-2" />
            Sign Out
          </button>
        </nav>
      )}

      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
