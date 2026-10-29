import type { User } from '../types';

export const FACEBOOK_DEFAULT_AVATAR_PATH = '/facebook-default-avatar.svg';

/**
 * Checks if a URL is from Google OAuth / Google Account
 */
export const isGoogleAvatar = (avatarUrl?: string | null): boolean => {
  if (!avatarUrl || typeof avatarUrl !== 'string') return false;
  return (
    avatarUrl.includes('googleusercontent.com') ||
    avatarUrl.includes('google.com') ||
    avatarUrl.includes('lh3.googleusercontent.com') ||
    avatarUrl.includes('lh4.googleusercontent.com') ||
    avatarUrl.includes('lh5.googleusercontent.com') ||
    avatarUrl.includes('lh6.googleusercontent.com')
  );
};

/**
 * Checks if the user authenticated with Google or has a Google avatar
 */
export const isGoogleUser = (user?: Partial<User> | null): boolean => {
  if (!user) return false;
  if ((user as any).authProvider === 'google' || (user as any).isGoogle) return true;
  return isGoogleAvatar(user.avatar);
};

/**
 * Checks if avatar is the old placeholder (unsplash image) or empty
 */
export const isPlaceholderOrEmptyAvatar = (avatarUrl?: string | null): boolean => {
  if (!avatarUrl || typeof avatarUrl !== 'string' || avatarUrl.trim() === '') {
    return true;
  }
  const clean = avatarUrl.trim().toLowerCase();
  if (clean === 'null' || clean === 'undefined' || clean === 'default' || clean.includes('unsplash.com')) {
    return true;
  }
  return false;
};

/**
 * Returns the effective avatar URL for a user:
 * - If logged in with Google (or has Google avatar): returns Google avatar
 * - If user uploaded a valid custom avatar: returns custom avatar
 * - If newly registered / non-Google without avatar: returns Facebook clone default avatar
 */
export const getUserAvatarUrl = (user?: Partial<User> | null): string => {
  if (!user) return FACEBOOK_DEFAULT_AVATAR_PATH;

  const avatar = user.avatar;

  // If avatar is empty or matches previous unsplash placeholder, return Facebook clone
  if (isPlaceholderOrEmptyAvatar(avatar)) {
    return FACEBOOK_DEFAULT_AVATAR_PATH;
  }

  // If user has a real avatar (Google avatar or custom avatar), use it
  return avatar as string;
};
