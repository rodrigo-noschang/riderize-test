import z from 'zod';

import { RidesRepository } from "../../repositories/rides-repository";

interface FetchRidesUseCaseRequest {
    page?: number
}

export class FetchRidesUseCase {
    constructor(private ridesRepository: RidesRepository) { }

    private validateFields(fields: FetchRidesUseCaseRequest) {
        const fieldsSchema = z.object({
            page: z.coerce.number().min(1).optional().default(1)
        });

        const validatedFields = fieldsSchema.parse(fields);
        return validatedFields
    }

    async execute(data: FetchRidesUseCaseRequest) {
        const { page } = this.validateFields(data);

        const rides = await this.ridesRepository.fetchRides(page)

        return {
            rides
        }
    }
}