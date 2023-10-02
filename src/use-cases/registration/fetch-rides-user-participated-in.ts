import z from "zod";
import { RegistrationRepository } from "../../repositories/registrations-repository";

interface FetchRidesUserParticipatedInRequest {
    userId: string,
    page?: number
}

export class FetchRidesUserParticipatedInUseCase {
    constructor(private registrationRepository: RegistrationRepository) { }

    /* ========================= aux functions ========================= */
    private validateFields(fields: FetchRidesUserParticipatedInRequest) {
        const fieldsSchema = z.object({
            userId: z.string(),
            page: z.coerce.number().min(1).optional().default(1)
        })

        const data = fieldsSchema.parse(fields);
        return data;
    }

    /* ==================== main routine ==========================*/
    async execute(fetchData: FetchRidesUserParticipatedInRequest) {
        const { userId, page } = this.validateFields(fetchData);

        const ridesUserRegisteredTo = await this.registrationRepository.fetchRidesUserRegisteredTo(userId, page);

        const rides = ridesUserRegisteredTo.map(registration => {
            return registration.ride_id;
        })

        return {
            rides
        }
    }
}