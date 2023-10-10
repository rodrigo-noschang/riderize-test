import { Prisma, Registration, Ride, User } from "@prisma/client";

export interface CreateResponse {
    user: User,
    ride: Ride
}

export interface RegistrationRepository {
    create(data: Prisma.RegistrationUncheckedCreateInput): Promise<CreateResponse | Registration>

    deleteRegistration(registrationId: string): Promise<void>

    fetchUsersRegisteredToARide(rideId: string, page: number): Promise<User[] | Registration[]>
    fetchRidesUserRegisteredTo(userId: string, page: number): Promise<Ride[] | Registration[]>
    fetchSpecificRegistration(userId: string, rideId: string): Promise<Registration | null>

    fetchRideParticipantsCount(rideId: string): Promise<number>
}