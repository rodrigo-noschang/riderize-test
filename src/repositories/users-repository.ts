import { Prisma, User } from "@prisma/client";

export interface UsersRepository {
    create(data: Prisma.UserCreateInput): Promise<User>

    findUniqueUserByEmail(email: string): Promise<User | null>
    findUniqueUserByPhone(phone: string): Promise<User | null>
}