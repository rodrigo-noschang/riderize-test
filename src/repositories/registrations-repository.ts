import { Prisma, Registration, Ride, User } from "@prisma/client";

export interface RegistrationRepository {
    create(data: Prisma.RegistrationUncheckedCreateInput): Promise<Registration>

    fetchRideRegisteredUsers(rideId: string, page: number): Promise<User[]>
    fetchRidesUserRegisteredTo(userId: string, page: number): Promise<Ride[]>
}