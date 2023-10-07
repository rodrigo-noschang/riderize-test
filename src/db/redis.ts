import Redis from 'ioredis';

export const redis = new Redis(6379, '0.0.0.0');