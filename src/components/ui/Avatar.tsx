import { User } from 'lucide-react';
import { AVATAR_ICONS, isAvatarIconKey } from '@/lib/content/avatarIcons';

export function Avatar({
  icon,
  size = 'sm',
  className,
}: {
  icon: string | null | undefined;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const Icon = icon && isAvatarIconKey(icon) ? AVATAR_ICONS[icon] : User;
  const box = size === 'sm' ? 'h-6 w-6' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 14 : 20;

  return (
    <span
      className={`bg-accent/15 text-accent-strong inline-flex shrink-0 items-center justify-center rounded-full ${box} ${className ?? ''}`}
    >
      <Icon size={iconSize} strokeWidth={2} />
    </span>
  );
}
