import { Prisma, Ride } from "@prisma/client";


export interface RidesRepository {
    create(data: Prisma.RideCreateInput): Promise<Ride>

    fetchRides(page: number): Promise<Ride[] | null>
}