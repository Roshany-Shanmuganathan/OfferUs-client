import { z } from 'zod';

// Sri Lankan districts
export const SRI_LANKAN_DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Moneragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
] as const;

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Member registration schema
export const memberRegisterSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    mobileNumber: z
      .string()
      .regex(/^(\+94|0)?[0-9]{9}$/, 'Invalid mobile number format'),
    address: z.string().min(1, 'Address is required'),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Partner registration schema
export const partnerRegisterSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    partnerName: z.string().min(1, 'Partner name is required'),
    shopName: z.string().min(1, 'Shop name is required'),
    location: z.object({
      street: z.string().min(1, 'Street address is required'),
      city: z.string().min(1, 'City is required'),
      district: z
        .string({
          required_error: 'Please select a district',
        })
        .refine(
          (val) => SRI_LANKAN_DISTRICTS.includes(val as any),
          {
            message: 'Please select a valid district',
          }
        ),
      postalCode: z
        .string()
        .regex(/^\d{5}$/, 'Postal code must be 5 digits'),
      coordinates: z
        .array(z.number())
        .length(2)
        .optional(),
    }),
    category: z.string().min(1, 'Category is required'),
    contactInfo: z.object({
      mobileNumber: z
        .string()
        .regex(/^(\+94|0)?[0-9]{9}$/, 'Invalid mobile number format'),
      website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type MemberRegisterFormData = z.infer<typeof memberRegisterSchema>;
export type PartnerRegisterFormData = z.infer<typeof partnerRegisterSchema>;

