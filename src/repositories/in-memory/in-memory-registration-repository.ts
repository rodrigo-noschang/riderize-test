import { randomUUID } from 'node:crypto';
import { Prisma, Registration } from "@prisma/client";

import { RegistrationRepository } from "../registrations-repository";
import { InMemoryRidesRepository } from './in-memory-rides-repository';

const DATA_PER_PAGE = 15;

export class InMemoryRegistrationRepository implements RegistrationRepository {
    public registrations: Registration[] = [];

    async create(data: Prisma.RegistrationUncheckedCreateInput) {
        const newRegistration: Registration = {
            ...data,
            registration_id: randomUUID(),
            subscription_date: new Date()
        }

        this.registrations.push(newRegistration);

        return newRegistration;
    }

    async fetchUsersRegisteredToARide(rideId: string, page: number) {
        const take = page * DATA_PER_PAGE;
        const skip = (page - 1) * DATA_PER_PAGE;

        const rideRegistrations = this.registrations.filter(registration => {
            return registration.ride_id === rideId;
        })

        const paginatedRides = rideRegistrations.slice(skip, take);

        return paginatedRides;
    }

    async fetchRidesUserRegisteredTo(userId: string, page: number) {
        const take = page * DATA_PER_PAGE;
        const skip = (page - 1) * DATA_PER_PAGE;

        const ridesUserRegisteredTo = this.registrations.filter(registration => {
            return registration.user_id === userId
        });

        const paginatedUsers = ridesUserRegisteredTo.slice(skip, take);

        return paginatedUsers;
    }

    async fetchAllOfUsersRegistrations(userId: string) {
        const registrations = this.registrations.filter(reg => {
            reg.user_id == userId;
        })

        return registrations;
    }
}