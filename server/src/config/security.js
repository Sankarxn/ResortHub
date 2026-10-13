import argon2 from 'argon2';

/**
 * Hash password strictly using Argon2id variant
 */
export const hashPassword = async (plainPassword) => {
  return await argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,         // 3 iterations
    parallelism: 1,
  });
};

/**
 * Verify password hash with plain text candidate
 */
export const verifyPassword = async (hash, plainPassword) => {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch (error) {
    return false;
  }
};
