import Redis from 'ioredis';

import { env } from '../env';

export const redis = new Redis(6379, env.REDISCLOUD_URL);