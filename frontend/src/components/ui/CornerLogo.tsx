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
  const [src, setSrc] = React.useState('/images/tdmu-logo.png');
  const [hide, setHide] = React.useState(false);

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
      <Link to={href} className={cn('pointer-events-auto block rounded-full ring-1 ring-black/5 shadow-lg overflow-hidden bg-white/95 backdrop-blur hover:scale-[1.03] transition-transform')}
        aria-label="TDMU logo"
      >
        {/* Fallback chain: tdmu-logo.png -> /images/logo.png -> text */}
        {src ? (
          <img
            src={src}
            alt="TDMU"
            className={cn('object-contain p-1.5', box)}
            onError={() => {
              if (src !== '/images/logo.png') setSrc('/images/logo.png');
              else setHide(true);
            }}
          />
        ) : (
          <div className={cn('flex items-center justify-center font-semibold text-xs text-gray-800', box)}>TDMU</div>
        )}
      </Link>
    </div>
  );
}
