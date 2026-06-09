type UserWithPassword = {
  password?: string;
  [key: string]: unknown;
};

export function sanitizeUser<T extends UserWithPassword>(user: T | null) {
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}
