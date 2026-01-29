import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Settings as SettingsIcon,
  LogOut,
  Package,
  ChevronRight,
  Menu,
  CreditCard,
} from "lucide-react";
import { useDataStore } from "../store/useDataStore";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "../components/ui/sidebar";
import { Separator } from "../components/ui/separator";

interface MainLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: TrendingUp },
  { name: "Shuttlecock", href: "/shuttlecock", icon: Package },
  { name: "Pembayaran", href: "/payments", icon: CreditCard },
  { name: "Members", href: "/members", icon: Users },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "History", href: "/history", icon: Clock },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDataStore();

  const handleLogout = () => {
    logout();
    toast.success("Berhasil logout");
    navigate("/login");
  };

  const getPageTitle = () => {
    const item = [...navigation, ...secondaryNavigation].find(
      (n) => n.href === location.pathname
    );
    return item?.name || "Dashboard";
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
        <SidebarHeader className="p-4">
          <Link to="/dashboard" className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-lg font-black tracking-tight text-sidebar-foreground">ShuttleCash</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Badminton Finance
              </span>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase text-muted-foreground/70 tracking-widest group-data-[collapsible=icon]:hidden">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                      tooltip={item.name}
                      className="transition-all duration-200 h-10 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Link to={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase text-muted-foreground/70 tracking-widest group-data-[collapsible=icon]:hidden">
              Configuration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryNavigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                      tooltip={item.name}
                      className="transition-all duration-200 h-10 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Link to={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <div className="flex flex-col gap-4 group-data-[collapsible=icon]:items-center">
            <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:hidden">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md ring-2 ring-background">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate text-sidebar-foreground">{user?.username}</span>
                <span className="text-[10px] text-muted-foreground font-medium">Administrator</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:rounded-lg"
            >
              <LogOut className="h-4 w-4 mr-2 group-data-[collapsible=icon]:mr-0" />
              <span className="group-data-[collapsible=icon]:hidden font-medium">Logout</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col min-w-0 bg-background transition-all duration-300 ease-in-out">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-xl px-6 shadow-sm">
          <SidebarTrigger className="-ml-2 text-foreground hover:bg-accent hover:text-accent-foreground" />
          <Separator orientation="vertical" className="h-4" />
          <div className="flex flex-1 items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">Pages</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 hidden sm:inline-block" />
            <h2 className="text-sm font-bold tracking-tight text-foreground">{getPageTitle()}</h2>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
