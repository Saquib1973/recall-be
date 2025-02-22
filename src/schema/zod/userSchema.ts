import { z } from 'zod'

export const userSignupSchema = z.object({
  username: z.string().transform((username) => username.trim().toLowerCase()),
  password: z
    .string()
    .min(5, 'Password must be atleast 5 characters long')
    .transform((password) => password.trim()),
})
export const userSignInSchema = z.object({
  username: z.string().transform((username) => username.trim().toLowerCase()),
  password: z
    .string()
    .min(5, 'Password must be atleast 5 characters long')
    .transform((password) => password.trim()),
})
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(5, 'Password must be atleast 5 characters long')
    .transform((password) => password.trim()),
})

