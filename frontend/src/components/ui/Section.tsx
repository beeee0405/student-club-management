import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import Container from './Container';

type SectionTone = 'white' | 'muted';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: SectionTone;
  containerSize?: 'content' | 'narrow' | 'wide' | 'full';
  centerContent?: boolean; // ✅ thêm props để chọn căn giữa theo chiều dọc
  paddingY?: 'none' | 'sm' | 'md' | 'lg'; // điều chỉnh khoảng cách dọc
}

export default function Section({
  id,
  children,
  className,
  tone = 'white',
  containerSize = 'wide',
  centerContent = false, // mặc định là false
  paddingY = 'lg',
}: SectionProps) {
  const paddingClass = (() => {
    switch (paddingY) {
      case 'none':
        return 'py-0';
      case 'sm':
        return 'py-8 md:py-12';
      case 'md':
        return 'py-16 md:py-24';
      case 'lg':
      default:
        return 'py-24 md:py-32';
    }
  })();
  return (
    <section
      id={id}
      className={cn(
        // Nếu centerContent = true thì căn giữa dọc
        centerContent
          ? cn('min-h-[600px] flex items-center justify-center', paddingClass)
          : paddingClass,
        tone === 'muted' ? 'bg-blue-50/40' : 'bg-white',
        'scroll-mt-24',
        className
      )}
    >
      <Container
        size={containerSize}
        className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {children}
      </Container>
    </section>
  );
}
