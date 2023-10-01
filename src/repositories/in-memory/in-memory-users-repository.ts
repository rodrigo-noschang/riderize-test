import { randomUUID } from 'node:crypto';
import { Prisma, User } from '@prisma/client';

import { UsersRepository } from "../users-repository";

export class InMemoryUserRepository implements UsersRepository {
    public users: User[] = []

    async create(data: Prisma.UserCreateInput) {
        const userData = {
            ...data,
            user_id: randomUUID(),
            user_city: data.user_city ?? null,
            user_uf: data.user_uf ?? null,
            phone: data.phone ?? null,
        }

        this.users.push(userData);
        return userData;
    }

    async findUniqueUserByEmail(email: string) {
        const existingUser = this.users.find(user => {
            return user.email === email
        })

        return existingUser ?? null;
    }

    async findUniqueUserByPhone(phone: string) {
        const existingUser = this.users.find(user => {
            return user.phone === phone
        })

        return existingUser ?? null;
    }
}