'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Badge({ children, variant = 'primary', size = 'md', className = '' }: BadgeProps) {
  const variantStyles = {
    primary: 'badge-primary bg-blue-500 text-white border-none',
    secondary: 'badge-secondary bg-sky-400 text-white border-none',
    success: 'badge-success bg-green-500 text-white border-none',
    warning: 'badge-warning bg-amber-400 text-gray-800 border-none',
    danger: 'badge-error bg-red-500 text-white border-none',
    info: 'badge-info bg-cyan-400 text-white border-none',
    ghost: 'badge-ghost bg-gray-100 text-gray-600 border-none',
  };

  const sizeStyles = {
    sm: 'badge-sm text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'badge-lg text-sm px-4 py-1',
  };

  return (
    <span className={`badge rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
}
