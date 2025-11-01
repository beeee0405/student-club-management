import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import CornerLogo from '../ui/CornerLogo';
import Container from '../ui/Container';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <CornerLogo position="bottom-right" size="md" href="/" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        {/* Layout: Left logo | Centered menu | Right actions */}
        <Container size="wide" className="grid grid-cols-3 items-center h-16">
          {/* Left: logo */}
          <div className="flex items-center pl-4 md:pl-6">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img 
                src="/images/Logo_TDMU_2024_nguyen_ban.png" 
                alt="TDMU" 
                className="h-10 w-auto"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.src = '/images/LOGO CLB.jpg';
                  img.onerror = () => { img.style.display = 'none'; };
                }}
              />
            </Link>
          </div>
          {/* Center: nav */}
          <nav className="hidden md:flex items-center justify-center gap-4">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <Link to="/clubs" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Câu lạc bộ
            </Link>
            {/* CLB theo Khoa/Viện dropdown đã được thay bằng quản lý động trên Home; menu tạm ẩn */}
            <Link to="/events" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Sự kiện
            </Link>
            <Link to="/user/profile" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Liên hệ
            </Link>
          </nav>
          {/* Right: actions */}
          <div className="flex items-center justify-end gap-3 pr-0">
            <ThemeToggle />
            <span className="text-sm text-gray-600 hidden sm:inline">Xin chào, {user?.name || 'Thành'}</span>
            <Button size="sm" variant="outline" onClick={handleLogout}>Đăng xuất</Button>
          </div>
        </Container>
      </header>

      {/* Hero Banner */}
      <section
        className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/bìa.jpg)',
          backgroundPosition: 'center center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <Container size="wide" className="relative h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Câu lạc bộ sinh viên
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl drop-shadow-md">
            Khám phá và tham gia các câu lạc bộ sinh viên đa dạng tại trường
          </p>
        </Container>
      </section>

      {/* Main content full width; child pages manage their own containers */}
      <main className="py-10">
        <Container size="wide">{children}</Container>
      </main>
    </div>
  );
};

export default UserLayout;
