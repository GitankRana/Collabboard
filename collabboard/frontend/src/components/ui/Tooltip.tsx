import { type ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  return (
    <div data-tip={text} className="relative inline-flex">
      {children}
    </div>
  );
}