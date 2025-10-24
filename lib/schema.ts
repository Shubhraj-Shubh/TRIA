import { z } from 'zod';

// Yeh phone object ke liye schema hai
export const phoneSchema = z.object({
  countryCode: z.string().startsWith('+', { message: "Must start with +" }).min(2, "Invalid code"),
  number: z.string().min(10, "Must be at least 10 digits").max(15, "Too long"),
});

// Yeh poore contact form ke liye schema hai
export const contactSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: phoneSchema, // Yahaan phone object ko nest kiya
});

// TypeScript type ko schema se generate kar rahe hain
export type ContactFormData = z.infer<typeof contactSchema>;
