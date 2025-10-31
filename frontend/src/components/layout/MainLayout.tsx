import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Container from '../ui/Container';
import { MapPin, Phone, Mail, Menu, X, Megaphone } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  // Control inner content width on non-home pages
  contentSize?: 'content' | 'narrow' | 'wide' | 'full';
}

const MainLayout = ({ children, contentSize = 'wide' }: MainLayoutProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleClubsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isHomePage) {
      scrollToSection('clubs');
    } else {
      navigate('/#clubs');
    }
  };

  const handleEventsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isHomePage) {
      scrollToSection('events');
    } else {
      navigate('/#events');
    }
  };

  const handleFacultyClubsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isHomePage) {
      // If already on homepage, scroll to the section
      scrollToSection('faculty-clubs');
    } else {
      // If on another page, navigate to home with hash
      navigate('/#faculty-clubs');
    }
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isHomePage) {
      scrollToSection('contact');
    } else {
      navigate('/#contact');
    }
  };

  React.useEffect(() => {
    // Close mobile menu on route change
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
  {/* ===== HEADER (fixed) ===== */}
  <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 shadow-sm">
  <Container
    size="full"
    className="h-16 px-2 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]"
  >
          {/* Logo + Org text */}
          <div className="flex items-center gap-3 justify-self-start">
            {/* Logo TDMU */}
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-0">
              <img
                src="/images/Logo_TDMU_2024_nguyen_ban.png"
                alt="TDMU"
                className="h-12 w-auto select-none border-0 outline-none ring-0 shadow-none"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.src = '/images/LOGO CLB.jpg';
                  img.onerror = () => {
                    img.style.display = 'none';
                  };
                }}
              />
            </Link>
            
            {/* Logo Đoàn */}
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img
                src="/images/Logo Đoàn Thanh NIên Cộng Sản Hồ Chí Minh.png"
                alt="Đoàn Thanh niên"
                className="h-12 w-12 object-contain select-none"
              />
            </Link>
            
            {/* Logo Hội Sinh viên */}
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img
                src="/images/Logo Hội Sinh Viên Việt Nam.png"
                alt="Hội Sinh viên"
                className="h-12 w-12 object-contain select-none"
              />
            </Link>

            {/* Tên đơn vị */}
            <div className="hidden lg:flex flex-col leading-tight ml-1">
              <span className="text-sm md:text-base lg:text-lg font-bold text-gray-800 whitespace-nowrap">
                Đoàn thanh niên - Hội sinh viên
              </span>
              <span className="text-xs md:text-sm lg:text-base text-gray-700 whitespace-nowrap">
                Trường Đại học Thủ Dầu Một
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-10 justify-self-center">
            <a
              href="#clubs"
              onClick={handleClubsClick}
              className="text-base font-medium text-gray-700 hover:text-blue-700 transition-colors cursor-pointer"
            >
              CLB
            </a>
            <a
              href="#events"
              onClick={handleEventsClick}
              className="text-base font-medium text-gray-700 hover:text-blue-700 transition-colors cursor-pointer"
            >
              Sự kiện
            </a>
            <a 
              href="#faculty-clubs" 
              onClick={handleFacultyClubsClick}
              className="text-base font-medium text-gray-700 hover:text-blue-700 transition-colors cursor-pointer"
            >
              CLB theo Trường Khoa Viện
            </a>
            <a
              href="#contact"
              onClick={handleContactClick}
              className="text-base font-medium text-gray-700 hover:text-blue-700 transition-colors cursor-pointer"
            >
              Liên hệ
            </a>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-base font-medium text-gray-700 hover:text-blue-700 transition-colors">
                Quản trị
              </Link>
            )}
          </nav>

          {/* Desktop actions (login/logout) */}
          <div className="hidden md:flex items-center gap-3 border-l pl-6 justify-self-end">
            {isAuthenticated ? (
              <>
                <span className="text-base text-gray-600 hidden md:inline">
                  Xin chào, {user?.name}
                </span>
                <Button size="sm" variant="outline" onClick={logout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">Đăng nhập</Link>
              </Button>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated ? (
              <Button size="sm" variant="outline" onClick={logout}>Đăng xuất</Button>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">Đăng nhập</Link>
              </Button>
            )}
            <button
              type="button"
              aria-label="Mở menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>

        {/* Announcement marquee */}
        <div className="border-t bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white">
          <div className="relative overflow-hidden py-1.5">
            {/* Static left icon */}
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none opacity-90">
              <Megaphone className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div
              className="marquee-track marquee-paused pl-8 pr-4 font-semibold tracking-wide text-[13px] sm:text-sm md:text-base text-glow"
              role="status"
              aria-live="polite"
            >
              <span className="mx-6">
                Chào mừng Đại hội Đại biểu Hội sinh viên Việt Nam Trường Đại học Thủ Dầu Một lần thứ VII, Nhiệm kỳ 2025 - 2028
              </span>
              <span className="mx-6" aria-hidden="true">• Chào mừng Đại hội Đại biểu Hội sinh viên Việt Nam Trường Đại học Thủ Dầu Một lần thứ VII, Nhiệm kỳ 2025 - 2028</span>
              <span className="mx-6" aria-hidden="true">• Chào mừng Đại hội Đại biểu Hội sinh viên Việt Nam Trường Đại học Thủ Dầu Một lần thứ VII, Nhiệm kỳ 2025 - 2028</span>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="md:hidden border-b bg-white shadow-sm">
            <Container size="full" className="py-3">
              <div className="flex flex-col gap-3">
                <a href="#clubs" onClick={handleClubsClick} className="text-base font-medium text-gray-700">CLB</a>
                <a href="#events" onClick={handleEventsClick} className="text-base font-medium text-gray-700">Sự kiện</a>
                <a href="#faculty-clubs" onClick={handleFacultyClubsClick} className="text-base font-medium text-gray-700">CLB theo Trường Khoa Viện</a>
                <a href="#contact" onClick={handleContactClick} className="text-base font-medium text-gray-700">Liên hệ</a>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-base font-medium text-gray-700">Quản trị</Link>
                )}
              </div>
            </Container>
          </div>
        )}
  </header>

  {/* Spacer to prevent content hiding under fixed header */}
  <div className="h-20" aria-hidden="true" />

      {/* ===== MAIN CONTENT ===== */}
      <main className={`flex-1 ${isHomePage ? 'max-w-full' : ''}`}>
        {isHomePage ? (
          // On the homepage, sections handle their own spacing
          <>{children}</>
        ) : (
          // For non-home pages, keep reasonable vertical rhythm between multiple sections
          <Container size={contentSize} className="py-6 space-y-10">{children}</Container>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer id="site-footer" className="mt-auto bg-blue-800 text-white">
        <Container size="full" className="py-6">
          <div className="flex flex-col items-center text-center gap-1 text-[13px] leading-relaxed">
            <div className="opacity-90">
              © {new Date().getFullYear()} - Đoàn Thanh niên - Hội sinh viên - Trường Đại học Thủ Dầu Một
            </div>
            <div className="flex items-center gap-2 opacity-90">
              <MapPin className="h-4 w-4" />
              <span>Số 06, đường Trần Văn Ơn, phường Phú Lợi, Thành phố Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-2 opacity-90">
              <Phone className="h-4 w-4" />
              <span>0878 60 86 88</span>
            </div>
            <div className="flex items-center gap-2 opacity-90">
              <Mail className="h-4 w-4" />
              <span>doanthanhnien@tdmu.edu.vn - hoisinhvien@tdmu.edu.vn</span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout;
