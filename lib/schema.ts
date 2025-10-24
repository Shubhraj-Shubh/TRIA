import { z } from 'zod';

// Phone validation regex patterns
const PHONE_NUMBER_REGEX = /^\d{10}$/; // Exactly 10 digits
const COUNTRY_CODE_REGEX = /^\+\d{1,4}$/; // +1 to +9999

// Phone object schema with strict validation
export const phoneSchema = z.object({
  countryCode: z
    .string()
    .regex(COUNTRY_CODE_REGEX, { message: "Country code must be in format: +91" })
    .refine(val => val.length >= 2 && val.length <= 5, {
      message: "Country code must be between 2-5 characters"
    }),
  number: z
    .string()
    .trim()
    .regex(PHONE_NUMBER_REGEX, { message: "Phone number must be exactly 10 digits" })
    .refine(val => !val.startsWith('0'), {
      message: "Phone number should not start with 0"
    }),
});

// Contact form schema with comprehensive validation
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must not exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name should only contain letters and spaces" }),
  
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address" })
    .min(5, { message: "Email must be at least 5 characters" })
    .max(100, { message: "Email must not exceed 100 characters" })
    .refine(val => val.includes('@') && val.includes('.'), {
      message: "Email must be a valid format"
    }),
  
  phone: phoneSchema,
});

// TypeScript type generated from schema
export type ContactFormData = z.infer<typeof contactSchema>;
