import bcrypt from "bcryptjs";

type HashOptions = {
  rounds?: number;
};

const DEFAULT_ROUNDS = 12;

export async function hashPassword(plain: string, options: HashOptions = {}) {
  const rounds = options.rounds ?? DEFAULT_ROUNDS;
  return bcrypt.hash(plain, rounds);
}

export async function verifyPassword(plain: string, hash: string) {
  if (!hash) return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch (error) {
    console.error("Failed to verify password", error);
    return false;
  }
}
