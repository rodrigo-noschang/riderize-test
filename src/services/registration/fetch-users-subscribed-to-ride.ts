import z from "zod";
import { RegistrationRepository } from "../../repositories/registrations-repository";

interface FetchUsersSubscribedToRideServiceRequest {
    rideId: string,
    page?: number
}

export class FetchUsersSubscribedToRideService {
    constructor(private registrationRepository: RegistrationRepository) { }

    /* ========================= aux functions ========================= */
    private validateFields(fields: FetchUsersSubscribedToRideServiceRequest) {
        const fieldsSchema = z.object({
            rideId: z.string(),
            page: z.coerce.number().min(1).optional().default(1)
        })

        const data = fieldsSchema.parse(fields);
        return data;
    }

    /* ==================== main routine ==========================*/
    async execute(fetchData: FetchUsersSubscribedToRideServiceRequest) {
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