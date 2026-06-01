interface AvatarProps {
  username: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

const sizes = {
  sm: { box: 'w-6 h-6', text: 'text-xs' },
  md: { box: 'w-8 h-8', text: 'text-sm' },
  lg: { box: 'w-10 h-10', text: 'text-base' },
};

export default function Avatar({
  username,
  color = '#6366f1',
  size = 'md',
  src,
}: AvatarProps) {
  const { box, text } = sizes[size];
  const initial = username?.[0]?.toUpperCase() || '?';

  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className={`${box} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${box} ${text} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ background: color }}
      title={username}
    >
      {initial}
    </div>
  );
}