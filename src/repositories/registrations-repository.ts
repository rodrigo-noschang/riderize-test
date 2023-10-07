import { Prisma, Registration, Ride, User } from "@prisma/client";

export interface RegistrationRepository {
    create(data: Prisma.RegistrationUncheckedCreateInput): Promise<Registration>

    fetchUsersRegisteredToARide(rideId: string, page: number): Promise<User[] | Registration[]>
    fetchRidesUserRegisteredTo(userId: string, page: number): Promise<Ride[] | Registration[]>
    fetchAllOfUsersRegistrations(userId: string): Promise<Registration[]>
}