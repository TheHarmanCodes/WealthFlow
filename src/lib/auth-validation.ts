import { z } from "zod";

/**
 * Sign In Validation Schema
 */
export const signInSchema = z.object({
  identifier: z.string().min(1, "Username or email is required").trim(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

export type SignInFormData = z.infer<typeof signInSchema>;

/**
 * Step 1: Account Details Schema
 */
export const signUpStep1Schema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  username: z
    .string()
    .min(3, "Username must be 3-30 characters")
    .max(30, "Username must be 3-30 characters")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "3-30 characters: letters, numbers, dots, underscores, hyphens",
    )
    .trim(),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Enter a valid email address")
    .toLowerCase()
    .trim(),
});

export type SignUpStep1FormData = z.infer<typeof signUpStep1Schema>;

/**
 * Password requirement rules for real-time visual checklist
 */
export interface PasswordRule {
  id: string;
  label: string;
  validate: (password: string, confirmPassword?: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: "At least 12 characters",
    validate: (p) => p.length >= 12,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    validate: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    validate: (p) => /[a-z]/.test(p),
  },
  {
    id: "number",
    label: "One number (0-9)",
    validate: (p) => /[0-9]/.test(p),
  },
  {
    id: "special",
    label: "One special character (!@#$%)",
    validate: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
  {
    id: "match",
    label: "Passwords match",
    validate: (p, cp) => !!p && !!cp && p === cp,
  },
];

/**
 * Step 2: Security Schema
 */
export const signUpStep2Schema = z
  .object({
    password: z
      .string()
      .min(12, "Password must be at least 12 characters")
      .regex(/[A-Z]/, "One uppercase letter required")
      .regex(/[a-z]/, "One lowercase letter required")
      .regex(/[0-9]/, "One number required")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "One special character required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpStep2FormData = z.infer<typeof signUpStep2Schema>;

/**
 * Step 3: Agreements & Verification Schema
 */
export const signUpStep3Schema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms of Service",
  }),
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: "You must accept the Privacy Policy",
  }),
  acceptCdr: z.boolean().refine((val) => val === true, {
    message: "You must consent to the CDR framework and Privacy Act",
  }),
  marketingConsent: z.boolean().default(false),
  otpCode: z
    .string()
    .length(6, "Please enter all 6 digits of the security code")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

export type SignUpStep3FormData = z.infer<typeof signUpStep3Schema>;

/**
 * Full Sign-Up state across all steps
 */
export interface SignUpState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptCdr: boolean;
  marketingConsent: boolean;
  otpCode: string;
}

export const initialSignUpState: SignUpState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: true,
  acceptPrivacy: true,
  acceptCdr: true,
  marketingConsent: false,
  otpCode: "",
};
