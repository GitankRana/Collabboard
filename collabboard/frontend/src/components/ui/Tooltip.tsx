import { type ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({
  text,
  children,
  position = 'top',
}: TooltipProps) {
  return (
    <div data-tip={text} className="relative inline-flex">
      {children}
    </div>
  );
}