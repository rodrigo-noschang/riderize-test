import z from 'zod';

import { RidesRepository } from "../../repositories/rides-repository";

interface FetchRidesCreatedByUserUseCaseRequest {
    userId: string
}

export class FetchRidesCreatedByUserUseCase {
    constructor(private ridesRepository: RidesRepository) { }

    // =================== aux functions ==================
    private validateFields(fields: FetchRidesCreatedByUserUseCaseRequest) {
        const fieldsSchema = z.object({
            userId: z.string()
        })

        const data = fieldsSchema.parse(fields);
        return data;
    }


    // ==================== main routine =================
    async execute(ridesCreatorId: FetchRidesCreatedByUserUseCaseRequest) {
        const { userId } = this.validateFields(ridesCreatorId);

        const rides = await this.ridesRepository.fetchRidesByCreator(userId);
        return {
            rides
        }
    }

}