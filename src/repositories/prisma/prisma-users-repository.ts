import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";

import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
    async create(data: Prisma.UserCreateInput) {
        const newUser = await prisma.user.create({
            data
        });

        return newUser;
    }

    async findUniqueUserByEmail(email: string) {
        const foundUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        return foundUser;
    }

    async findUniqueUserByPhone(phone: string) {
        if (!phone) return null;

        const foundUser = await prisma.user.findUnique({
            where: {
                phone
            }
        });

        return foundUser;
    }
}