import { randomUUID } from 'node:crypto';
import { Prisma, Ride } from "@prisma/client";

import { RidesRepository } from "../rides-repository";

const RIDES_PER_PAGE = 15;

export class InMemoryRidesRepository implements RidesRepository {
    public rides: Ride[] = [];

    async create(data: Prisma.RideUncheckedCreateInput) {
        const rideData = {
            ...data,
            ride_id: randomUUID(),
            additional_information: data.additional_information ?? null,
            participants_limit: data.participants_limit ?? null,

            start_date: new Date(data.start_date),
            start_date_registration: new Date(data.start_date_registration),
            end_date_registration: new Date(data.end_date_registration),
        }

        this.rides.push(rideData);

        return rideData;
    }

    async fetchRides(page: number) {
        const skip = (page - 1) * RIDES_PER_PAGE;
        const take = page * RIDES_PER_PAGE;

        const rides = this.rides.slice(skip, take);

        return rides;
    }

    async fetchRideById(rideId: string) {
        const ride = this.rides.find(ride => {
            return ride.ride_id === rideId
        });

        return ride ?? null;
    }
}