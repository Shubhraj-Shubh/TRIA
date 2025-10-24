import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAvatarUrl(name: string): string {
  const avatar = createAvatar(avataaars, {
    seed: name,
    size: 128,
  });

  return avatar.toDataUri();
}