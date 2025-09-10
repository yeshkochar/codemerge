import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, FileText, User, Menu, X, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  const activeLinkClass = isActive ? 'bg-saarthi-light text-saarthi-blue font-semibold' : 'text-gray-600 hover:bg-saarthi-light';
  return (
    <Link to={to} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeLinkClass}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate('/signin');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const navItems = [
    { to: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { to: "/scheme-chat", icon: <MessageCircle size={20} />, label: "Scheme Assistance" },
    { to: "/complaint", icon: <FileText size={20} />, label: "File Complaint" },
    { to: "/profile", icon: <User size={20} />, label: "Profile" }
  ];
  
  const renderNavigation = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.to}
          />
        ))}
      </div>
      <div className="mt-auto pt-4">
        <Button 
          variant="ghost" 
          className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 p-3">
                    <div className="w-10 h-10 rounded-full bg-saarthi-orange flex items-center justify-center text-white font-bold text-xl">
                      S
                    </div>
                    <span className="text-xl font-semibold text-saarthi-blue">Sahayak Seva</span>
                  </div>
                  {renderNavigation()}
                </div>
              </SheetContent>
            </Sheet>
          )}
          <div className="w-10 h-10 rounded-full bg-saarthi-orange flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="text-xl font-semibold text-saarthi-blue">Sahayak Seva</span>
        </div>
        {!isMobile && (
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        )}
      </header>
      
      <div className="flex flex-1">
        {!isMobile && (
          <aside className="w-64 bg-white shadow-sm p-4 hidden md:block">
            {renderNavigation()}
          </aside>
        )}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
