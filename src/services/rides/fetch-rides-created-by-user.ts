import z from 'zod';

import { RidesRepository } from "../../repositories/rides-repository";

interface FetchRidesCreatedByUserServiceRequest {
    userId: string,
    page?: number
}

export class FetchRidesCreatedByUserService {
    constructor(private ridesRepository: RidesRepository) { }

    // =================== aux functions ==================
    private validateFields(fields: FetchRidesCreatedByUserServiceRequest) {
        const fieldsSchema = z.object({
            userId: z.string(),
            page: z.coerce.number().min(1).default(1)
        })

        const data = fieldsSchema.parse(fields);
        return data;
    }


    // ==================== main routine =================
    async execute(ridesCreatorId: FetchRidesCreatedByUserServiceRequest) {
        const { userId, page } = this.validateFields(ridesCreatorId);

        const rides = await this.ridesRepository.fetchRidesByCreator(userId, page);
        return {
            rides
        }
    }

}