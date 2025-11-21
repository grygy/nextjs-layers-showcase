import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
});

export const userIdSchema = z.object({
  id: z.uuid('User ID must be a valid UUID'),
});

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdInput = z.infer<typeof userIdSchema>;
export type UserOutput = z.infer<typeof userSchema>;

