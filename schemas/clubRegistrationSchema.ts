import { z } from "zod";

export const clubRegisterSchema = z.object({
    name: z.string().min(3, 'Name is required'),
    slug: z
      .string()
      .min(3, 'Slug is required')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase letters, numbers & hyphens only'),
    description: z.string().min(10, 'Description is required'),
    about: z.string().min(10, 'About section is required'),
    contactEmail: z.string().email('Must be a valid email').optional(),
    contactPhone: z
      .string()
      .min(7, 'Phone too short')
      .max(20, 'Phone too long')
      .optional(),
    coverImage: z.string().url('Must be a valid URL').optional(),
    logoImage: z.string().url('Must be a valid URL').optional(),
  });