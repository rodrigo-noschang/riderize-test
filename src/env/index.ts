import z from 'zod';
import 'dotenv/config';

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number().default(4000),
    REDISCLOUD_URL: z.string()
});

export const env = envSchema.parse(process.env);