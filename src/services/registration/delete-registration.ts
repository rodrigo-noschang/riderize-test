import z from 'zod';

import { RidesRepository } from "../../repositories/rides-repository";

import { MustBeRegisteredToRideError } from './must-be-registered-to-ride';
import { InstanceNotFoundError } from "../../errors/instance-not-found";
import { RegistrationRepository } from '../../repositories/registrations-repository';

interface DeleteRegistrationServiceRequest {
    rideId: string,
    userId: string
}

export class DeleteRegistrationService {
    constructor(
        private ridesRepository: RidesRepository,
        private registrationsRepository: RegistrationRepository
    ) { }

    // =============== aux functions ==============================
    validateFields(fields: DeleteRegistrationServiceRequest) {
        const fieldsSchema = z.object({
            userId: z.string(),
            rideId: z.string()
        })

        const data = fieldsSchema.parse(fields);
        return data;
    }

    private async checkIfRideExists(rideId: string) {
        const ride = await this.ridesRepository.fetchRideById(rideId);

        if (!ride) throw new InstanceNotFoundError('ride');
        return ride;
    }

    private async checkIfUserIsRegisteredToRide(rideId: string, userId: string) {
        const registration = await this.registrationsRepository.fetchSpecificRegistration(userId, rideId);

        if (!registration) throw new MustBeRegisteredToRideError();

        return registration.registration_id;
    }

    // ========================== main routine ===========================
    async execute(requestData: DeleteRegistrationServiceRequest) {
        const { rideId, userId } = this.validateFields(requestData);

        const ride = await this.checkIfRideExists(rideId);

        const registrationId = await this.checkIfUserIsRegisteredToRide(rideId, userId);

        await this.registrationsRepository.deleteRegistration(registrationId);

        return registrationId;
    }
}