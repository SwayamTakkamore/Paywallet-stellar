'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  DollarSign,
  History,
  Download,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useAppStore } from '@/store';
import { cn } from '@/lib/utils';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  const employerMenuItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/employer', icon: Home },
    { label: 'Employees', href: '/employer/employees', icon: Users },
    { label: 'Payroll', href: '/employer/payroll', icon: CreditCard },
    { label: 'Payments', href: '/employer/payments', icon: DollarSign },
    { label: 'Analytics', href: '/employer/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/employer/settings', icon: Settings },
  ];

  const workerMenuItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/worker', icon: Home },
    { label: 'Salary History', href: '/worker/history', icon: History },
    { label: 'Withdraw', href: '/worker/withdraw', icon: Download },
    { label: 'Profile', href: '/worker/profile', icon: User },
    { label: 'Settings', href: '/worker/settings', icon: Settings },
  ];

  const menuItems = user?.role === 'employer' ? employerMenuItems : workerMenuItems;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-green-50 flex">
      {/* Sidebar - Always visible on desktop, toggleable on mobile */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-green-200 shadow-lg transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:relative lg:flex lg:flex-col'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-green-200 bg-gradient-to-r from-green-50 to-green-100">
            <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="ml-2 text-xl font-bold text-green-900">PayWallet</span>
            </Link>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-green-200 bg-gradient-to-r from-green-50 to-green-25">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-green-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-green-600 capitalize font-medium">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href || 
                             (item.href !== '/employer' && item.href !== '/worker' && pathname.startsWith(item.href)) ||
                             (pathname === '/employer' && item.href === '/employer') ||
                             (pathname === '/worker' && item.href === '/worker');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm',
                    isActive 
                      ? 'bg-green-100 text-green-800 border-r-4 border-green-600 shadow-sm font-semibold' 
                      : 'text-green-700 hover:bg-green-50 hover:text-green-900'
                  )}
                  onClick={() => setSidebarOpen(false)}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'slideInLeft 0.3s ease-out forwards'
                  }}
                >
                  <item.icon className={cn(
                    "mr-3 h-5 w-5 transition-transform duration-200 hover:scale-110",
                    isActive ? "text-green-700" : "text-green-600"
                  )} />
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-green-200 bg-gradient-to-r from-green-25 to-green-50">
            <Button
              variant="ghost"
              className="w-full justify-start text-green-700 hover:bg-green-100 hover:text-green-900 font-medium transition-all duration-200 hover:scale-[1.02]"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-green-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="ml-2 text-xl font-bold text-green-900">PayWallet</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-green-700 hover:bg-green-50"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <main className="flex-1 pt-16 lg:pt-0 bg-green-50">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
