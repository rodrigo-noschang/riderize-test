import Redis from 'ioredis';

import { env } from '../env';

// Deploy
export const redis = new Redis(env.REDIS_TLS_URL, {
    tls: {
        rejectUnauthorized: false
    }
});


// Local
// export const redis = new Redis(6379, "0.0.0.0");