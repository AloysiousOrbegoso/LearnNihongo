import {
  Cat,
  Dog,
  Bird,
  Fish,
  Rabbit,
  Turtle,
  Mountain,
  Waves,
  Flower2,
  Compass,
  Star,
  Music,
  Coffee,
  Sun,
  Moon,
  Leaf,
  type LucideIcon,
} from 'lucide-react';

export const AVATAR_ICON_KEYS = [
  'cat',
  'dog',
  'bird',
  'fish',
  'rabbit',
  'turtle',
  'mountain',
  'waves',
  'flower',
  'compass',
  'star',
  'music',
  'coffee',
  'sun',
  'moon',
  'leaf',
] as const;

export type AvatarIconKey = (typeof AVATAR_ICON_KEYS)[number];

export const AVATAR_ICONS: Record<AvatarIconKey, LucideIcon> = {
  cat: Cat,
  dog: Dog,
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit,
  turtle: Turtle,
  mountain: Mountain,
  waves: Waves,
  flower: Flower2,
  compass: Compass,
  star: Star,
  music: Music,
  coffee: Coffee,
  sun: Sun,
  moon: Moon,
  leaf: Leaf,
};

export function isAvatarIconKey(value: string): value is AvatarIconKey {
  return (AVATAR_ICON_KEYS as readonly string[]).includes(value);
}
