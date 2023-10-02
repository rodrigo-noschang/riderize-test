import z from "zod";
import { RegistrationRepository } from "../../repositories/registrations-repository";

interface FetchUsersSubscribedToRideRequest {
    rideId: string
}

export class FetchUsersSubscribedToRide {
    constructor(private registrationRepository: RegistrationRepository) { }

    /* ========================= aux functions ========================= */
    private validateFields(fields: FetchUsersSubscribedToRideRequest) {
        const fieldsSchema = z.object({
            rideId: z.string()
        })

        const data = fieldsSchema.parse(fields);
        return data;
    }

    /* ==================== main routine ==========================*/
    async execute(fetchData: FetchUsersSubscribedToRideRequest) {
        const { rideId } = this.validateFields(fetchData);

        const rideRegistrations = await this.registrationRepository.fetchRideRegisteredUsers(rideId);

        const registeredUsers = rideRegistrations.map(registration => {
            return registration.ride_id;
        })

        return {
            users: registeredUsers
        }
    }
}