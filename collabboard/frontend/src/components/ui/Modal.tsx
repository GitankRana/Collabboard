import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  width = '440px',
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content w-full"
        style={{ maxWidth: width }}
      >
        {/* Header */}
        {title && (
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <h2
              className="font-semibold text-base"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}