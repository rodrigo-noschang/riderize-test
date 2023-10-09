import { Prisma, Registration, Ride, User } from "@prisma/client";

export interface CreateResponse {
    user: User,
    ride: Ride
}

export interface RegistrationRepository {
    create(data: Prisma.RegistrationUncheckedCreateInput): Promise<CreateResponse | Registration>

    fetchUsersRegisteredToARide(rideId: string, page: number): Promise<User[] | Registration[]>
    fetchRidesUserRegisteredTo(userId: string, page: number): Promise<Ride[] | Registration[]>
}