import { z } from 'zod';

// ============================================================================
// Sri Lankan Districts
// ============================================================================

const SRI_LANKAN_DISTRICTS_TUPLE = [
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
] as [string, ...string[]];

export const SRI_LANKAN_DISTRICTS = SRI_LANKAN_DISTRICTS_TUPLE;

export type SriLankanDistrict = (typeof SRI_LANKAN_DISTRICTS)[number];

// ============================================================================
// Login Schema
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// Member Registration Schema
// ============================================================================

export const memberRegisterSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    mobileNumber: z
      .string()
      .regex(/^(\+94|0)?[0-9]{9}$/, 'Please enter a valid Sri Lankan mobile number'),
    address: z.string().min(1, 'Address is required'),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type MemberRegisterFormData = z.infer<typeof memberRegisterSchema>;

// ============================================================================
// Partner Registration Schema
// ============================================================================

export const partnerRegisterSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    partnerName: z.string().min(1, 'Partner name is required'),
    shopName: z.string().min(1, 'Shop name is required'),
    location: z.object({
      street: z.string().min(1, 'Street address is required'),
      city: z.string().min(1, 'City is required'),
      district: z.enum(SRI_LANKAN_DISTRICTS_TUPLE, {
        message: 'Please select a valid district',
      }),
      postalCode: z
        .string()
        .regex(/^\d{5}$/, 'Postal code must be 5 digits'),
      coordinates: z.tuple([z.number(), z.number()]).optional(),
    }),
    category: z.string().min(1, 'Category is required'),
    contactInfo: z.object({
      mobileNumber: z
        .string()
        .regex(/^(\+94|0)?[0-9]{9}$/, 'Please enter a valid Sri Lankan mobile number'),
      website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type PartnerRegisterFormData = z.infer<typeof partnerRegisterSchema>;
