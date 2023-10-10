import z from 'zod';
import { Ride } from "@prisma/client";

import { RidesRepository } from "../../repositories/rides-repository";

import { CreatorOnlyError } from "../../errors/creator-only";
import { InstanceNotFoundError } from "../../errors/instance-not-found";

interface DeleteRideServiceRequest {
    rideId: string,
    userId: string
}

export class DeleteRideService {
    constructor(private ridesRepository: RidesRepository) { }

    // =============== aux functions ==============================
    validateFields(fields: DeleteRideServiceRequest) {
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

    private async checkIfUserIsRideCreator(ride: Ride, userId: string) {
        const didUserCreateRide = ride.creator_id === userId;

        if (!didUserCreateRide) throw new CreatorOnlyError('ride');

        return didUserCreateRide;
    }

    // ========================== main routine ===========================
    async execute(requestData: DeleteRideServiceRequest) {
        const { rideId, userId } = this.validateFields(requestData);

        const ride = await this.checkIfRideExists(rideId);

        await this.checkIfUserIsRideCreator(ride, userId);

        await this.ridesRepository.deleteRide(rideId);

        return rideId;
    }
}