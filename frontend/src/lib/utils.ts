import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Build full URL for assets returned by the API (e.g., /uploads/xxx.jpg)
export function assetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  // If already absolute (http/https/data), return as-is
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  const apiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';
  const origin = apiUrl.replace(/\/?api\/?$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalized}`;
}