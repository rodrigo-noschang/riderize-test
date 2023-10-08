import Redis from 'ioredis';

import { env } from '../env';

export const redis = new Redis(env.REDIS_TLS_URL, {
    tls: {
        rejectUnauthorized: false
    }
});