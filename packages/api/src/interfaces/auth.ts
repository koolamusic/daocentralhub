import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(32),
});

export interface SignUp {
  email: string;
  password: string;
  name: string;
  companyName?: string;
  country?: string;
  jobRole?: string;
}

export const signUpSchema = loginSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  companyName: z.string(),
  companyPhone: z.string().optional(),
  country: z.string(),
  jobRole: z.string(),
});

export const verifyEmailSchema = z.object({
  id: z.string(),
  token: z.string(),
});

export const resetPasswordSchema = z.object({
  email: z.string(),
  otp: z.string(),
  newPassword: z.string(),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
export type IEmail = Pick<z.infer<typeof loginSchema>, 'email'>;
export type IVerifyEmail = z.infer<typeof verifyEmailSchema>;
export type IResetPassword = z.infer<typeof resetPasswordSchema>;
