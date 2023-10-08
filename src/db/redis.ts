import Redis from 'ioredis';

import { env } from '../env';

export const redis = new Redis(
    env.REDISCLOUD_PORT,
    env.REDISCLOUD_URL,
    {
        connectTimeout: 10000,
        port: env.REDISCLOUD_PORT,
        host: env.REDISCLOUD_URL
    }
);