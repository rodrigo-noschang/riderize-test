import { Prisma, Registration } from "@prisma/client";

export interface RegistrationRepository {
    create(data: Prisma.RegistrationUncheckedCreateInput): Promise<Registration>

    fetchRideRegisteredUsers(rideId: string, page: number): Promise<Registration[]>
    fetchRidesUserRegisteredTo(userId: string, page: number): Promise<Registration[]>
}