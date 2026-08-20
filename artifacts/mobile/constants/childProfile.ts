export type ChildAvatarItem = {
  id: string;
  emoji: string;
  name: string;
  bg: string;
  accent: string;
};

export type ChildSymbolItem = {
  id: string;
  emoji: string;
  name: string;
  color: string;
};

export type ChildThemeColor = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  light: string;
  border: string;
};

export const CHILD_AVATARS: ChildAvatarItem[] = [
  { id: 'lion', emoji: '🦁', name: 'Leo Lion', bg: '#FFE8D6', accent: '#FF9F1C' },
  { id: 'panda', emoji: '🐼', name: 'Pip Panda', bg: '#EAEAEA', accent: '#4A4E69' },
  { id: 'bunny', emoji: '🐰', name: 'Bella Bunny', bg: '#FFE5EC', accent: '#FF70A6' },
  { id: 'kitty', emoji: '🐱', name: 'Mia Kitty', bg: '#FFF1E6', accent: '#F4A261' },
  { id: 'puppy', emoji: '🐶', name: 'Buddy Puppy', bg: '#FDE2E4', accent: '#E76F51' },
  { id: 'fox', emoji: '🦊', name: 'Foxy', bg: '#FFEDD8', accent: '#E85D04' },
  { id: 'astro', emoji: '🚀', name: 'Astro Hero', bg: '#E0F2FE', accent: '#0284C7' },
  { id: 'unicorn', emoji: '🦄', name: 'Sparkle', bg: '#F3E8FF', accent: '#9333EA' },
  { id: 'dino', emoji: '🦖', name: 'Dino Hero', bg: '#DCFCE7', accent: '#16A34A' },
  { id: 'bear', emoji: '🐻', name: 'Teddy Bear', bg: '#FEF3C7', accent: '#D97706' },
];

export const CHILD_SYMBOLS: ChildSymbolItem[] = [
  { id: 'star', emoji: '⭐', name: 'Star', color: '#FFD166' },
  { id: 'rocket', emoji: '🚀', name: 'Rocket', color: '#3AB0FF' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', color: '#FF6B8B' },
  { id: 'lightning', emoji: '⚡', name: 'Lightning', color: '#F7B731' },
  { id: 'crown', emoji: '👑', name: 'Crown', color: '#FFB800' },
  { id: 'heart', emoji: '❤️', name: 'Heart', color: '#EF476F' },
  { id: 'palette', emoji: '🎨', name: 'Art', color: '#B57BFF' },
  { id: 'flower', emoji: '🌸', name: 'Flower', color: '#FF99C8' },
  { id: 'clover', emoji: '🍀', name: 'Lucky Clover', color: '#06D6A0' },
  { id: 'diamond', emoji: '💎', name: 'Diamond', color: '#4CC9F0' },
];

export const CHILD_COLORS: ChildThemeColor[] = [
  { id: 'amber', name: 'Amber Sun', primary: '#FF9F1C', secondary: '#FFE8D6', light: '#FFF9F2', border: '#E08300' },
  { id: 'sky', name: 'Ocean Sky', primary: '#118AB2', secondary: '#E0F2FE', light: '#F0F9FF', border: '#0C6C8C' },
  { id: 'mint', name: 'Mint Green', primary: '#06D6A0', secondary: '#DCFCE7', light: '#F2FDF8', border: '#04A77B' },
  { id: 'pink', name: 'Bubble Pink', primary: '#EF476F', secondary: '#FFE5EC', light: '#FFF0F5', border: '#C92A52' },
  { id: 'purple', name: 'Magic Purple', primary: '#9D4EDD', secondary: '#F3E8FF', light: '#FAF5FF', border: '#7826BA' },
  { id: 'coral', name: 'Coral Joy', primary: '#FF6B6B', secondary: '#FFE5D9', light: '#FFF5F0', border: '#E04848' },
];

export const PRESET_NICKNAMES = [
  'Champion',
  'Explorer',
  'Super Star',
  'Hero',
  'Captain',
  'Little Champ',
];
