import z from 'zod';
import 'dotenv/config';

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number().default(4000),
    REDISCLOUD_URL: z.string(),
    REDISCLOUD_PORT: z.coerce.number().default(6379)
});

export const env = envSchema.parse(process.env);