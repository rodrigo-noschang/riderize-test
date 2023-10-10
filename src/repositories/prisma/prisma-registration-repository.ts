import { Prisma } from "@prisma/client";

import { CreateResponse, RegistrationRepository } from "../registrations-repository";
import { prisma } from "../../db/prisma";

const CONTENT_PER_PAGE = 15;

export class PrismaRegistrationRepository implements RegistrationRepository {
    async create(data: Prisma.RegistrationUncheckedCreateInput) {
        const newRegistration = await prisma.registration.create({
            data
        });

        const registration = await prisma.registration.findUnique({
            where: {
                registration_id: newRegistration.registration_id
            },
            select: {
                user: true,
                ride: true
            }
        }) as CreateResponse

        return registration;
    }

    async deleteRegistration(registrationId: string) {
        await prisma.registration.delete({
            where: {
                registration_id: registrationId
            }
        });
    }

    async fetchUsersRegisteredToARide(rideId: string, page: number) {
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

    async fetchSpecificRegistration(userId: string, rideId: string) {
        const registration = await prisma.registration.findFirst({
            where: {
                user_id: userId,
                ride_id: rideId,
            }
        })

        return registration;
    }

    async fetchRideParticipantsCount(rideId: string) {
        const participantsAmount = await prisma.registration.count({
            where: {
                ride_id: rideId
            }
        })

        return participantsAmount;
    }
}