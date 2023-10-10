import { Prisma, Ride } from "@prisma/client";


export interface RidesRepository {
    create(data: Prisma.RideUncheckedCreateInput): Promise<Ride>

    deleteRide(rideId: string): Promise<void>

    fetchRides(page: number): Promise<Ride[]>
    fetchRideById(rideId: string): Promise<Ride | null>
    fetchRidesByCreator(userId: string, page: number): Promise<Ride[]>
}