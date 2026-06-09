import React, { useState } from 'react';
import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { Menu, X, LayoutDashboard, Package, Tags, User as UserIcon, LogOut } from 'lucide-react';
import { getStoredUser, clearAuthSession } from '../../lib/auth-storage';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '../../lib/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuthSession();
    queryClient.clear();
    navigate({ to: '/login' });
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/dashboard/products', icon: <Package size={20} /> },
    { name: 'Categories', path: '/dashboard/categories', icon: <Tags size={20} /> },
    { name: 'Profile', path: '/dashboard/profile', icon: <UserIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white h-16 px-4 border-b border-[#dddddd] shrink-0">
        <Link to="/dashboard" className="text-xl font-bold text-[#ff385c]">Priceyless</Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#222222] p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Desktop + Mobile Drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#dddddd] transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex md:flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-[#dddddd] shrink-0 hidden md:flex">
          <Link to="/dashboard" className="text-2xl font-bold text-[#ff385c]">Priceyless</Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-4">
            {navItems.map((item) => {
              const isActive = routerState.location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-[#f2f2f2] text-[#222222]" 
                      : "text-[#6a6a6a] hover:bg-[#f7f7f7] hover:text-[#222222]"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#dddddd] shrink-0">
          <div className="flex items-center mb-4 px-2">
            <div className="h-10 w-10 bg-[#f2f2f2] rounded-full flex items-center justify-center text-[#ff385c] font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-[#222222] truncate">{user?.name}</p>
              <p className="text-xs text-[#6a6a6a] truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-[#c13515] hover:bg-[#fff8f9] transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar Desktop */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-white border-b border-[#dddddd] shrink-0">
          <div className="text-lg font-semibold text-[#222222]">
            {navItems.find(i => i.path === routerState.location.pathname)?.name || 'Dashboard'}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#f7f7f7]">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
