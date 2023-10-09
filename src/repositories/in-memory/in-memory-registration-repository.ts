import { randomUUID } from 'node:crypto';
import { Prisma, Registration, Ride, User } from "@prisma/client";

import { RegistrationRepository } from "../registrations-repository";
import { InMemoryUserRepository } from './in-memory-users-repository';
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

        const paginatedRideRegistrations = rideRegistrations.slice(skip, take);

        return paginatedRideRegistrations;
    }

    async fetchRidesUserRegisteredTo(userId: string, page: number) {
        const take = page * DATA_PER_PAGE;
        const skip = (page - 1) * DATA_PER_PAGE;

        const ridesUserRegisteredTo = this.registrations.filter(registration => {
            return registration.user_id === userId
        });

        const paginatedUserRegistrations = ridesUserRegisteredTo.slice(skip, take);

        return paginatedUserRegistrations;
    }
}