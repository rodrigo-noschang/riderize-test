import z from "zod";
import dayjs from "dayjs";
import { Ride } from "@prisma/client";

import { RidesRepository } from "../../repositories/rides-repository";
import { RegistrationRepository } from "../../repositories/registrations-repository";

import { InvalidDatesError } from "../../errors/invalid-dates";
import { InstanceNotFoundError } from "../../errors/instance-not-found";
import { AlreadyRegisteredError } from "../../errors/already-registered";
import { RideCreatorCanNotRegisterError } from "../../errors/ride-creator-can-not-register";

interface CreateRegistrationServiceRequest {
    userId: string,
    rideId: string
}

export class CreateRegistrationService {
    constructor(
        private registrationsRepository: RegistrationRepository,
        private ridesRepository: RidesRepository
    ) { }

    /* ====================== aux functions ========================== */
    private validateFields(fields: CreateRegistrationServiceRequest) {
        const fieldsSchema = z.object({
            userId: z.string(),
            rideId: z.string()
        })

        const data = fieldsSchema.parse(fields);
        return data;
    }

    private checkIfRideExists(rideId: string) {
        const ride = this.ridesRepository.fetchRideById(rideId);

        return ride;
    }

    private checkIfCreationDateIsWithinRegistrationRange(registrationStart: Date, registrationEnd: Date) {
        const startDate = dayjs(registrationStart);
        const endDate = dayjs(registrationEnd);
        const today = dayjs(new Date());

        return (
            (today.isAfter(startDate) || today.isSame(startDate)) &&
            (today.isBefore(endDate) || today.isSame(endDate))
        )
    }

    private async checkIfUserIsAlreadyRegisteredToThisRide(userId: string, rideId: string) {
        const userRegistrations = await this.registrationsRepository.fetchAllOfUsersRegistrations(userId);

        const isRegisteredToThisRide = userRegistrations.find(registration => {
            return registration.ride_id === rideId;
        })

        return isRegisteredToThisRide;
    }

    private async checkIfUserIsOwnRide(ride: Ride, userId: string) {
        const rideCreatorId = ride.creator_id;

        return rideCreatorId === userId
    }

    /* ========================== main routine ============================ */
    async execute(newRegistrationData: CreateRegistrationServiceRequest) {
        const data = this.validateFields(newRegistrationData);

        const rideExists = await this.checkIfRideExists(data.rideId);

        if (!rideExists) throw new InstanceNotFoundError('ride');

        const isRegistrationAllowed = this.checkIfCreationDateIsWithinRegistrationRange(
            rideExists.start_date_registration,
            rideExists.end_date_registration
        )

        if (!isRegistrationAllowed) {
            throw new InvalidDatesError('registration period is over or did not start yet');
        }

        const isUserRegisteredToThisRide = await this.checkIfUserIsAlreadyRegisteredToThisRide(data.userId, data.rideId);
        if (isUserRegisteredToThisRide) throw new AlreadyRegisteredError();

        const isUserTheRideCreator = await this.checkIfUserIsOwnRide(rideExists, data.userId);
        if (isUserTheRideCreator) throw new RideCreatorCanNotRegisterError();

        const registration = await this.registrationsRepository.create({
            user_id: data.userId,
            ride_id: data.rideId,
        });

        return {
            registration
        }
    }
}