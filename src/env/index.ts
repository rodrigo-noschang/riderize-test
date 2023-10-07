import z from 'zod';
import 'dotenv/config';

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number().default(4000)
});

export const env = envSchema.parse(process.env);