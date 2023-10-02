import z from "zod";
import { RegistrationRepository } from "../../repositories/registrations-repository";

interface FetchUsersSubscribedToRideRequest {
    rideId: string,
    page?: number
}

export class FetchUsersSubscribedToRideUseCase {
    constructor(private registrationRepository: RegistrationRepository) { }

    /* ========================= aux functions ========================= */
    private validateFields(fields: FetchUsersSubscribedToRideRequest) {
        const fieldsSchema = z.object({
            rideId: z.string(),
            page: z.coerce.number().min(1).optional().default(1)
        })

        const data = fieldsSchema.parse(fields);
        return data;
    }

    /* ==================== main routine ==========================*/
    async execute(fetchData: FetchUsersSubscribedToRideRequest) {
        const { rideId, page } = this.validateFields(fetchData);

        const rideRegistrations = await this.registrationRepository.fetchRideRegisteredUsers(rideId, page);

        const registeredUsers = rideRegistrations.map(registration => {
            return registration.user_id;
        })

        return {
            users: registeredUsers
        }
    }
}