import z from "zod";
import dayjs from "dayjs";
import { Ride } from "@prisma/client";

import { RidesRepository } from "../../repositories/rides-repository";
import { RegistrationRepository } from "../../repositories/registrations-repository";

import { InvalidDatesError } from "../../errors/invalid-dates";
import { InstanceNotFoundError } from "../../errors/instance-not-found";
import { AlreadyRegisteredError } from "../../errors/already-registered";
import { ReachedParticipantsLimitError } from "../../errors/participants-limit-reached";
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
            rideId: z.string(),
            page: z.coerce.number().min(1).default(1)
        })

        const data = fieldsSchema.parse(fields);
        return data;
    }

    private async checkIfRideExists(rideId: string) {
        const ride = await this.ridesRepository.fetchRideById(rideId);

        if (!ride) throw new InstanceNotFoundError('ride');

        return ride;
    }

    private checkIfCreationDateIsWithinRegistrationRange(registrationStart: Date, registrationEnd: Date) {
        const startDate = dayjs(registrationStart);
        const endDate = dayjs(registrationEnd);
        const today = dayjs(new Date());

        const isRegistrationAllowed = (
            (today.isAfter(startDate) || today.isSame(startDate)) &&
            (today.isBefore(endDate) || today.isSame(endDate))
        )

        if (!isRegistrationAllowed) {
            throw new InvalidDatesError('registration period is over or did not start yet');
        }
    }

    private async checkIfUserIsAlreadyRegisteredToThisRide(userId: string, rideId: string, page: number) {
        const userRegistrations = await this.registrationsRepository.fetchRidesUserRegisteredTo(userId, page);

        const isRegisteredToThisRide = userRegistrations.find(registration => {
            return registration.ride_id === rideId;
        })

        if (isRegisteredToThisRide) throw new AlreadyRegisteredError();
    }

    private async checkIfUserIsOwnRide(ride: Ride, userId: string) {
        const isUserTheRideCreator = ride.creator_id === userId;

        if (isUserTheRideCreator) throw new RideCreatorCanNotRegisterError();
    }

    private async checkParticipantsLimit(ride: Ride) {
        if (!ride.participants_limit) return;

        const currentParticipants = await this.registrationsRepository.fetchRideParticipantsCount(ride.ride_id);

        if (currentParticipants >= ride.participants_limit) {
            throw new ReachedParticipantsLimitError();
        }
    }

    /* ========================== main routine ============================ */
    async execute(newRegistrationData: CreateRegistrationServiceRequest) {
        const data = this.validateFields(newRegistrationData);

        const rideExists = await this.checkIfRideExists(data.rideId);

        this.checkIfCreationDateIsWithinRegistrationRange(
            rideExists.start_date_registration,
            rideExists.end_date_registration
        )

        await this.checkIfUserIsAlreadyRegisteredToThisRide(data.userId, data.rideId, data.page);

        await this.checkIfUserIsOwnRide(rideExists, data.userId);

        await this.checkParticipantsLimit(rideExists);

        const registration = await this.registrationsRepository.create({
            user_id: data.userId,
            ride_id: data.rideId,
        });

        return {
            registration
        }
    }
}