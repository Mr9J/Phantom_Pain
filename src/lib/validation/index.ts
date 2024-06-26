import { z } from "zod";

const PasswordValidation = z
  .string()
  .min(8, { message: "密碼長度至少8字" })
  .max(24, { message: "密碼長度至少24字" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,24}$/, {
    message:
      "密碼必須包含至少一個大寫字母、一個小寫字母、一個數字和一個特殊字符",
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
  caption: z.string().min(2, { message: "主文不可少於2字" }).max(2200),
  file: z.custom<File[]>(),
  location: z.string().max(30),
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

const ProfilePasswordValidation = z
  .string()
  .refine(
    (value) =>
      value === "" ||
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,24}$/.test(value),
    {
      message:
        "密碼必須包含至少一個大寫字母、一個小寫字母、一個數字和一個特殊字符",
    }
  );

export const ProfileEditValidation = z
  .object({
    nickname: z
      .string()
      .min(2, { message: "暱稱長度至少2字" })
      .max(50, { message: "暱稱長度至多50字" }),
    username: z
      .string()
      .min(8, { message: "帳號長度至少8字" })
      .max(24, { message: "帳號長度至多24字" }),
    thumbnail: z.custom<File[]>(),
    email: z.string().email({ message: "email格式錯誤" }).optional(),
    password: ProfilePasswordValidation,
    confirmPassword: z.string().default(""),
    address: z.string().max(200),
    memberIntroduction: z.string(),
    phone: z
      .string()
      .refine((value) => value === "" || /^0\d{9}$/.test(value), {
        message: "電話號碼格式錯誤",
      }),
  })
  .refine(
    (data) => data.password === "" || data.password === data.confirmPassword,
    {
      message: "密碼不一致",
      path: ["confirmPassword"],
    }
  );

export const ProfileEditPValidation = z
  .object({
    nickname: z
      .string()
      .min(2, { message: "暱稱長度至少2字" })
      .max(50, { message: "暱稱長度至多50字" }),
    username: z
      .string()
      .min(8, { message: "帳號長度至少8字" })
      .max(50, { message: "帳號長度至多24字" }),
    thumbnail: z.custom<File[]>(),
    email: z.string(),
    password: ProfilePasswordValidation,
    confirmPassword: z.string().default(""),
    address: z.string().max(200),
    memberIntroduction: z.string(),
    phone: z
      .string()
      .refine((value) => value === "" || /^0\d{9}$/.test(value), {
        message: "電話號碼格式錯誤",
      }),
  })
  .refine(
    (data) => data.password === "" || data.password === data.confirmPassword,
    {
      message: "密碼不一致",
      path: ["confirmPassword"],
    }
  );

export const GroupFormValidation = z.object({
  groupName: z
    .string()
    .min(2, { message: "群組名稱不可小於2字" })
    .max(50, { message: "群組名稱不可大於50字" }),
  username: z.string().max(24, { message: "帳號長度至多24字" }),
});
