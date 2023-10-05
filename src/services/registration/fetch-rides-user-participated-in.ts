import z from "zod";
import { RegistrationRepository } from "../../repositories/registrations-repository";

interface FetchRidesUserParticipatedInServiceRequest {
    userId: string,
    page?: number
}

export class FetchRidesUserParticipatedInService {
    constructor(private registrationRepository: RegistrationRepository) { }

    /* ========================= aux functions ========================= */
    private validateFields(fields: FetchRidesUserParticipatedInServiceRequest) {
        const fieldsSchema = z.object({
            userId: z.string(),
            page: z.coerce.number().min(1).optional().default(1)
        })

        const data = fieldsSchema.parse(fields);
        return data;
    }

    /* ==================== main routine ==========================*/
    async execute(fetchData: FetchRidesUserParticipatedInServiceRequest) {
        const { userId, page } = this.validateFields(fetchData);

        const ridesUserRegisteredTo = await this.registrationRepository.fetchRidesUserRegisteredTo(userId, page);

        return {
            rides: ridesUserRegisteredTo
        }
    }
}