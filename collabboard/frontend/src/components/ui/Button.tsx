import { type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:   'text-white',
    secondary: 'border',
    ghost:     'border-none',
    danger:    'text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2   text-sm gap-2',
    lg: 'px-6 py-3   text-base gap-2',
  };

  const styles = {
    primary: {
      background: 'var(--brand-primary)',
      color: 'white',
    },
    secondary: {
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-default)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      background: '#ef4444',
      color: 'white',
    },
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], className)}
      style={styles[variant]}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}