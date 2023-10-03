import z from 'zod';

import { RidesRepository } from "../../repositories/rides-repository";

interface FetchRidesServiceRequest {
    page?: number
}

export class FetchRidesService {
    constructor(private ridesRepository: RidesRepository) { }

    /* =========================== aux functions =================== */
    private validateFields(fields: FetchRidesServiceRequest) {
        const fieldsSchema = z.object({
            page: z.coerce.number().min(1).optional().default(1)
        });

        const validatedFields = fieldsSchema.parse(fields);
        return validatedFields
    }

    /* =========================== main routine =================== */
    async execute(data: FetchRidesServiceRequest) {
        const { page } = this.validateFields(data);

        const rides = await this.ridesRepository.fetchRides(page)

        return {
            rides
        }
    }
}