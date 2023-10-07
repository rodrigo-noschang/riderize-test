import { ZodError } from "zod";
import { GraphQLError } from "graphql";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { RideModel } from "../dtos/models/rides.model";
import { FetchRidesCreatedByUserInput, FetchRidesInput, RegisterRideInput } from "../dtos/inputs/rides.inputs";

import { FetchRidesService } from "../services/rides/fetch-rides";
import { CreateRideService } from "../services/rides/create-ride";
import { PrismaRidesRepository } from "../repositories/prisma/prisma-rides-repository";
import { FetchRidesCreatedByUserService } from "../services/rides/fetch-rides-created-by-user";

import { redis } from "../db/redis";
import { AuthContext } from "../utils/token-related";
import { InvalidDatesError } from "../errors/invalid-dates";

async function readFromCache() {
    const cachedData = await redis.get('rides');

    return cachedData ? JSON.parse(cachedData) as RideModel[] : null;
}

async function writeOnCache(data: any) {
    const stringifiedData = JSON.stringify(data);

    await redis.set('rides', stringifiedData, 'EX', 20);
}


@Resolver()
export class RidesResolver {

    @Authorized()
    @Mutation(returns => RideModel)
    async registerRide(
        @Arg('data') data: RegisterRideInput,
        @Ctx() ctx: AuthContext
    ) {
        try {
            const { userId } = ctx;

            const prismaRepository = new PrismaRidesRepository();
            const service = new CreateRideService(prismaRepository);

            const { ride } = await service.execute({
                ...data,
                creator_id: userId
            });

            return ride;
        } catch (error) {
            let errorMessage = '';
            let errorType = '';

            if (error instanceof ZodError) {
                errorMessage = JSON.stringify(error.format());
                errorType = 'FIELD_VALIDATION';
            }

            if (error instanceof InvalidDatesError) {
                errorMessage = error.message;
                errorType = error.type;
            }

            throw new GraphQLError(errorMessage, {
                extensions: {
                    errorType
                }
            });
        }

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

        const cachedRides = await readFromCache();

        if (!cachedRides) {
            const prismaRepository = new PrismaRidesRepository();
            const service = new FetchRidesService(prismaRepository);

            const { rides } = await service.execute({ page });

            await writeOnCache(rides);
            return rides;
        }

        return cachedRides;
    }
}