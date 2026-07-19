'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  type = 'button',
  onClick,
}: ButtonProps) {
  const baseStyles =
    'btn inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg';

  const variantStyles: Record<string, string> = {
    primary: 'btn-primary bg-blue-500 hover:bg-blue-600 text-white border-none',
    secondary: 'btn bg-sky-400 hover:bg-sky-500 text-white border-none',
    ghost: 'btn-ghost hover:bg-blue-50 text-gray-700 border-none',
    danger: 'btn-error bg-red-500 hover:bg-red-600 text-white border-none',
    success: 'btn-success bg-green-500 hover:bg-green-600 text-white border-none',
    outline: 'btn-outline border-blue-400 text-blue-500 hover:bg-blue-50',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'btn-sm text-xs px-3 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'btn-lg text-base px-6 py-3',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </motion.button>
  );
}
