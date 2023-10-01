import { Prisma, User } from "@prisma/client";
import { RegisterUserUseCase } from "../use-cases/users/register-user";
import { InMemoryUserRepository } from "./in-memory/in-memory-users-repository";

export interface UsersRepository {
    create(data: Prisma.UserCreateInput): Promise<User>

    findUniqueUserByEmail(email: string): Promise<User | null>
    findUniqueUserByPhone(phone: string): Promise<User | null>
}