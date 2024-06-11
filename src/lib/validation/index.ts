import { z } from "zod";

const PasswordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(24, { message: "Password must be at most 24 characters long" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/, {
    message: "密碼必須包含至少一個大寫字母、一個小寫字母和一個數字",
  });

export const SignUpValidation = z
  .object({
    nickname: z
      .string()
      .min(2, { message: "暱稱長度至少2字" })
      .max(50, { message: "暱稱長度至多50字" }),
    username: z
      .string()
      .min(8, { message: "帳號長度至少8字" })
      .max(24, { message: "帳號長度至多24字" }),
    email: z.string().email({ message: "email格式錯誤" }),
    password: PasswordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不一致",
    path: ["confirmPassword"],
  });

export const SignInValidation = z.object({
  username: z
    .string()
    .min(8, { message: "帳號長度至少8字" })
    .max(24, { message: "帳號長度至多24字" }),
  password: z
    .string()
    .min(8, { message: "密碼長度至少8字" })
    .max(24, { message: "密碼長度至多24字" }),
});

export const PostValidation = z.object({
  caption: z.string().min(2).max(2200),
  file: z.custom<File[]>(),
  location: z.string().max(200),
  tags: z.string(),
});

export const ResetPasswordValidation = z
  .object({
    password: PasswordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不一致",
    path: ["confirmPassword"],
  });

export const SendResetEmailValidation = z.object({
  email: z.string().email({ message: "Email格式錯誤" }),
});
