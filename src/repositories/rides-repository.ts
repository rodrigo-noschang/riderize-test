import { Prisma, Ride } from "@prisma/client";


export interface RidesRepository {
    create(data: Prisma.RideUncheckedCreateInput): Promise<Ride>

    fetchRides(page: number): Promise<Ride[] | null>
    fetchRideById(rideId: string): Promise<Ride | null>
    fetchRidesByCreator(userId: string, page: number): Promise<Ride[]>
}