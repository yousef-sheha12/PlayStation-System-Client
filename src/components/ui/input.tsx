'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="form-control w-full"
      >
        {label && (
          <label className="label">
            <span className="label-text font-medium text-gray-700">{label}</span>
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`input input-bordered w-full rounded-xl bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${icon ? 'pl-10' : ''} ${error ? 'input-error border-red-400' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <label className="label">
            <span className="label-text-alt text-red-500">{error}</span>
          </label>
        )}
      </motion.div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
