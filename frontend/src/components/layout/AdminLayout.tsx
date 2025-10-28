import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import CornerLogo from '../ui/CornerLogo';
import { LayoutDashboard, Users, Building2, Calendar, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Bảng điều khiển', href: '/admin', icon: LayoutDashboard },
    { name: 'Người dùng', href: '/admin/users', icon: Users },
    { name: 'Câu lạc bộ', href: '/admin/clubs', icon: Building2 },
    { name: 'Sự kiện', href: '/admin/events', icon: Calendar },
  ] as const;

  const handleLogout = async () => {
    await logout();
  };

  // Breadcrumb navigation for contextual clarity
  const getBreadcrumbs = () => {
    const p = location.pathname;
    if (p === '/admin') return [{ label: 'Bảng điều khiển', href: '/admin' }];
    if (p.startsWith('/admin/users')) return [
      { label: 'Bảng điều khiển', href: '/admin' },
      { label: 'Người dùng', href: '/admin/users' }
    ];
    if (p.startsWith('/admin/clubs')) return [
      { label: 'Bảng điều khiển', href: '/admin' },
      { label: 'Câu lạc bộ', href: '/admin/clubs' }
    ];
    if (p.startsWith('/admin/events')) return [
      { label: 'Bảng điều khiển', href: '/admin' },
      { label: 'Sự kiện', href: '/admin/events' }
    ];
    return [{ label: 'Bảng quản trị', href: '/admin' }];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <CornerLogo position="bottom-left" size="sm" href="/" className="z-30" />
      {/* Sidebar */}
      <aside
        className={cn(
          'sticky top-0 z-40 flex h-[100dvh] flex-col border-r border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out',
          collapsed ? 'w-20' : 'w-72'
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div
            className={cn(
              'flex items-center gap-3 overflow-hidden transition-all duration-300',
              collapsed && 'opacity-0'
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold shadow-md">
              CLB
            </div>
            <span className="font-bold text-lg text-gray-800 whitespace-nowrap">Quản lý CLB</span>
          </div>

          {collapsed && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold shadow-md mx-auto">
              CLB
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 transition-transform duration-200',
                    isActive && 'scale-110',
                    !isActive && 'group-hover:scale-110'
                  )}
                />
                <span
                  className={cn(
                    'whitespace-nowrap transition-all duration-300',
                    collapsed ? 'hidden opacity-0 w-0' : 'opacity-100'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Thu gọn</span>
              </>
            )}
          </button>
        </div>
      </aside>

    {/* Main Content */}
  <div className="flex-1">
        {/* Header */}
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="relative flex h-20 items-center justify-between pl-6 pr-3">
            {/* Breadcrumb navigation */}
            <nav className="flex items-center gap-2 text-sm">
              {getBreadcrumbs().map((crumb, idx, arr) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  <Link
                    to={crumb.href}
                    className={`transition-colors ${
                      idx === arr.length - 1
                        ? 'font-semibold text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {crumb.label}
                  </Link>
                  {idx < arr.length - 1 && <span className="text-gray-400">/</span>}
                </div>
              ))}
            </nav>

            {/* User Section (right) */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-800">{user?.name || 'Admin'}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>

              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold shadow-md">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>

              <Button size="sm" variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-6 pb-8 px-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;