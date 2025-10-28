import * as React from 'react';
import { cn } from '../../lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'content' | 'narrow' | 'wide' | 'full';
}

const sizeClass: Record<NonNullable<ContainerProps['size']>, string> = {
  content: 'max-w-[1200px]',  // 👈 vừa khít giao diện desktop
  narrow: 'max-w-5xl',
  wide: 'max-w-[1400px]',
  full: 'max-w-none',         // 👈 dùng cho banner hoặc full-width section
};

/**
 * ✅ Container chuẩn web TDMU:
 * - Giới hạn max-width hợp lý (không bị trải ngang)
 * - Tự căn giữa với mx-auto
 * - Padding hai bên linh hoạt theo kích thước màn hình
 * - Không bị overflow ngang khi kết hợp flex/grid
 */
export default function Container({
  size = 'wide',
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        sizeClass[size],
        // 👇 padding đều – giống layout clbtdmu.id.vn
        'mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 overflow-x-hidden',
        className
      )}
      {...props}
    />
  );
}
