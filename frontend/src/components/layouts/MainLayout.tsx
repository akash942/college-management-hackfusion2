// src/components/layouts/MainLayout.tsx
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  LayoutDashboard,
  Vote,
  Stethoscope,
  Calendar,
  FileText,
  GraduationCap,
  MessageSquare,
  DollarSign,
  Menu,
  X,
  LogOut,
  Bell,
  ChevronDown,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "../../lib/utils";

// Define navigation items
const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/elections", label: "Elections", icon: Vote },
  { path: "/health", label: "Health & Leave", icon: Stethoscope },
  { path: "/facilities", label: "Facility Booking", icon: Calendar },
  { path: "/applications", label: "Applications", icon: FileText },
  { path: "/academic", label: "Academic Integrity", icon: GraduationCap },
  { path: "/complaints", label: "Complaints", icon: MessageSquare },
  { path: "/budget", label: "Budget & Finance", icon: DollarSign },
];

const MainLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Create initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">College Portal</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center p-2 rounded-md transition-colors",
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>College Portal</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center p-2 rounded-md transition-colors",
                        location.pathname === item.path
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="mr-2 h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <Sheet>
              <SheetTrigger asChild className="md:hidden mr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <h1 className="text-lg font-semibold md:hidden">College Portal</h1>
            <div className="ml-auto flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Bell className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.name || "User"} />
                      <AvatarFallback>
                        {user?.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} College Portal. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
