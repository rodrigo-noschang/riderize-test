import z from 'zod';
import 'dotenv/config';

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    REDIS_URL: z.string()
});

export const env = envSchema.parse(process.env);