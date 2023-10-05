import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { RideModel } from "../dtos/models/rides.model";
import { FetchRidesCreatedByUserInput, FetchRidesInput, RegisterRideInput } from "../dtos/inputs/rides.inputs";

import { AuthContext } from "../utils/token-related";
import { CreateRideService } from "../services/rides/create-ride";
import { PrismaRidesRepository } from "../repositories/prisma/prisma-rides-repository";
import { FetchRidesCreatedByUserService } from "../services/rides/fetch-rides-created-by-user";
import { FetchRidesService } from "../services/rides/fetch-rides";


@Resolver()
export class RidesResolver {

    @Authorized()
    @Mutation(returns => RideModel)
    async registerRide(
        @Arg('data') data: RegisterRideInput,
        @Ctx() ctx: AuthContext
    ) {
        const { userId } = ctx;

        const prismaRepository = new PrismaRidesRepository();
        const service = new CreateRideService(prismaRepository);

        const { ride } = await service.execute({
            ...data,
            creator_id: userId
        });

        return ride;
    }

    @Authorized()
    @Query(returns => [RideModel])
    async fetchRidesCreatedByUser(
        @Arg('data') data: FetchRidesCreatedByUserInput
    ) {
        const { page, userId } = data;

        const prismaRepository = new PrismaRidesRepository();
        const service = new FetchRidesCreatedByUserService(prismaRepository);

        const { rides } = await service.execute({ page, userId });

        return rides
    }

    @Authorized()
    @Query(returns => [RideModel])
    async fetchRides(
        @Arg('data') data: FetchRidesInput
    ) {
        const { page } = data;

        const prismaRepository = new PrismaRidesRepository();
        const service = new FetchRidesService(prismaRepository);

        const { rides } = await service.execute({ page });

        return rides;
    }
}