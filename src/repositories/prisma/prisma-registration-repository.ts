import { Prisma } from "@prisma/client";

import { RegistrationRepository } from "../registrations-repository";
import { prisma } from "../../db/prisma";

const CONTENT_PER_PAGE = 15;

export class PrismaRegistrationRepository implements RegistrationRepository {
    async create(data: Prisma.RegistrationUncheckedCreateInput) {
        const newRegistration = await prisma.registration.create({
            data
        });

        return newRegistration;
    }

    async fetchRideRegisteredUsers(rideId: string, page: number) {
        const take = CONTENT_PER_PAGE;
        const skip = CONTENT_PER_PAGE * (page - 1);

        const response = await prisma.registration.findMany({
            where: {
                ride_id: rideId
            },
            select: {
                user: true
            },
            take,
            skip
        });

        return response.map(res => res.user);
    }

    async fetchRidesUserRegisteredTo(userId: string, page: number) {
        const take = CONTENT_PER_PAGE;
        const skip = CONTENT_PER_PAGE * (page - 1);

        const response = await prisma.registration.findMany({
            where: {
                user_id: userId
            },
            select: {
                ride: true
            },
            take,
            skip
        })

        return response.map(res => res.ride);
    }
}