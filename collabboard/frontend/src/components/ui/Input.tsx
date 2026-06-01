import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  className,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </label>
      )}

      <input
        className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${className || ''}`}
        style={{
          background: 'var(--bg-secondary)',
          border: error
            ? '1px solid #ef4444'
            : '1px solid var(--border-strong)',
          color: 'var(--text-primary)',
        }}
        {...props}
      />

      {error && (
        <p className="text-xs" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}