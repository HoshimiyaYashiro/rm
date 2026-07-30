import { z } from 'zod';

export const emailSchema = z.email().max(128);

export const passwordSchema = z.string().min(8).max(24).regex(/[A-Z]/);