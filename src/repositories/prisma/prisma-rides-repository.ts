import { Prisma } from "@prisma/client";
import { RidesRepository } from "../rides-repository";

import { prisma } from "../../db/prisma";

const CONTENT_PER_PAGE = 15;

export class PrismaRidesRepository implements RidesRepository {
    async create(data: Prisma.RideUncheckedCreateInput) {
        const newRide = await prisma.ride.create({
            data
        });

        return newRide;
    }

    async deleteRide(rideId: string) {
        await prisma.ride.delete({
            where: {
                ride_id: rideId
            }
        });
    }

    async fetchRideById(rideId: string) {
        const foundRide = await prisma.ride.findUnique({
            where: {
                ride_id: rideId
            }
        });

        return foundRide;
    }

    async fetchRides(page: number) {
        const take = CONTENT_PER_PAGE;
        const skip = CONTENT_PER_PAGE * (page - 1);

        const rides = await prisma.ride.findMany({
            take,
            skip
        });

        return rides;
    }

    async fetchRidesByCreator(userId: string, page: number) {
        const take = CONTENT_PER_PAGE;
        const skip = CONTENT_PER_PAGE * (page - 1);

        const rides = await prisma.ride.findMany({
            where: {
                creator_id: userId
            },
            take,
            skip
        });

        return rides;
    }
}