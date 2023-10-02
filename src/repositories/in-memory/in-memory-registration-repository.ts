import { randomUUID } from 'node:crypto';
import { Prisma, Registration } from "@prisma/client";

import { RegistrationRepository } from "../registrations-repository";

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

    async fetchRideRegisteredUsers(rideId: string) {
        const rideRegistrations = this.registrations.filter(registration => {
            return registration.ride_id === rideId;
        })

        return rideRegistrations;
    }
}