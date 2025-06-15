import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile menu
import { Menu, X, LayoutDashboard, LineChart, ShoppingCart, Wallet, Zap, UserCircle } from 'lucide-react'; // Example icons

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/markets', label: 'Markets', icon: LineChart },
  { href: '/trade', label: 'Trade', icon: ShoppingCart }, // Simplified icon for trade
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/earn', label: 'Earn', icon: Zap },
];

const NavigationMenu: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  console.log("Rendering NavigationMenu, current path:", location.pathname);

  const commonLinkClasses = "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkClasses = "bg-primary text-primary-foreground";
  const inactiveLinkClasses = "text-muted-foreground hover:bg-accent hover:text-accent-foreground";

  const renderNavLinks = (isMobile: boolean = false) => navItems.map((item) => (
    <Link
      key={item.label}
      to={item.href}
      onClick={() => isMobile && setMobileMenuOpen(false)}
      className={`${commonLinkClasses} ${location.pathname.startsWith(item.href) ? activeLinkClasses : inactiveLinkClasses} ${isMobile ? 'text-base space-x-3' : 'space-x-2'}`}
    >
      <item.icon className={`h-5 w-5 ${isMobile ? 'mr-3' : ''}`} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className="bg-card border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl text-primary">
              {/* Replace with your Logo Component or SVG */}
              AscendEX
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:ml-10 md:space-x-1 lg:space-x-4">
            {renderNavLinks()}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {/* Placeholder for Theme Toggle, Notifications, User Profile */}
            <Button variant="ghost" size="icon">
              <UserCircle className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                <div className="flex justify-between items-center mb-6">
                   <Link to="/" className="font-bold text-xl text-primary" onClick={() => setMobileMenuOpen(false)}>
                     AscendEX
                   </Link>
                   <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                     <X className="h-6 w-6" />
                   </Button>
                </div>
                <nav className="flex flex-col space-y-2">
                  {renderNavLinks(true)}
                  <hr className="my-4"/>
                  <Button variant="ghost" className="justify-start space-x-3">
                    <UserCircle className="h-5 w-5 mr-3" />
                    <span>Profile</span>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;