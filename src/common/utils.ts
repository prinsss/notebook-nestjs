import { hash, compare } from 'bcrypt'

export async function createPassword(password: string): Promise<string> {
  return await hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await compare(password, hash)
}
