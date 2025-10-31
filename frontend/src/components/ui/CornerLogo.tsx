import * as React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface CornerLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: Corner;
  href?: string;
  size?: 'sm' | 'md';
}

const posClass: Record<Corner, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

export default function CornerLogo({ position = 'bottom-right', href = '/', size = 'md', className, ...props }: CornerLogoProps) {
  const [src] = React.useState('/images/Logo_TDMU_2024_nguyen_ban.png');
  const [hide, setHide] = React.useState(false);

  // Additional logos
  const doanLogo = '/images/logo_doan_thanh_nien.png';
  const hoiSVLogo = '/images/logo_hoi_sinh_vien.png';

  // sizes
  const box = size === 'sm' ? 'h-10 w-10' : 'h-14 w-14';

  if (hide) return null;

  return (
    <div
      className={cn(
        'pointer-events-none fixed z-40',
        posClass[position],
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {/* Logo Đoàn */}
        <Link 
          to={href} 
          className={cn('pointer-events-auto block rounded-full ring-1 ring-black/5 shadow-lg overflow-hidden bg-white/95 backdrop-blur hover:scale-[1.03] transition-transform')}
          aria-label="Đoàn Thanh niên"
        >
          <img
            src={doanLogo}
            alt="Đoàn Thanh niên"
            className={cn('object-contain p-1.5', box)}
          />
        </Link>

        {/* Logo Hội Sinh viên */}
        <Link 
          to={href} 
          className={cn('pointer-events-auto block rounded-full ring-1 ring-black/5 shadow-lg overflow-hidden bg-white/95 backdrop-blur hover:scale-[1.03] transition-transform')}
          aria-label="Hội Sinh viên"
        >
          <img
            src={hoiSVLogo}
            alt="Hội Sinh viên"
            className={cn('object-contain p-1.5', box)}
          />
        </Link>

        {/* Logo TDMU */}
        <Link 
          to={href} 
          className={cn('pointer-events-auto block rounded-full ring-1 ring-black/5 shadow-lg overflow-hidden bg-white/95 backdrop-blur hover:scale-[1.03] transition-transform')}
          aria-label="TDMU logo"
        >
          {src ? (
            <img
              src={src}
              alt="TDMU"
              className={cn('object-contain p-1.5', box)}
              onError={() => {
                setHide(true);
              }}
            />
          ) : (
            <div className={cn('flex items-center justify-center text-xs font-bold text-primary', box)}>
              TDMU
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
