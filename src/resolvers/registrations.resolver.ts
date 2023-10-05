import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { AuthContext } from "../utils/token-related";

import { RideModel } from "../dtos/models/rides.model";
import { UserModel } from "../dtos/models/users.model";
import { RegistrationModel } from "../dtos/models/registrations.model";
import { CreateRegistrationInput, FetchRidesUserParticipatedInInput, FetchUsersSubscribedToRideInput } from "../dtos/inputs/registrations.input";

import { PrismaRidesRepository } from "../repositories/prisma/prisma-rides-repository";
import { CreateRegistrationService } from "../services/registration/create-registration";
import { PrismaRegistrationRepository } from "../repositories/prisma/prisma-registration-repository";
import { FetchUsersSubscribedToRideService } from "../services/registration/fetch-users-subscribed-to-ride";
import { FetchRidesUserParticipatedInService } from "../services/registration/fetch-rides-user-participated-in";

@Resolver()
export class RegistrationsResolver {

    @Authorized()
    @Mutation(returns => RegistrationModel)
    async createRegistration(
        @Arg('data') data: CreateRegistrationInput,
        @Ctx() ctx: AuthContext
    ) {
        const { userId } = ctx;
        const { rideId } = data;

        const prismaRegistrationRepository = new PrismaRegistrationRepository();
        const prismaRidesRepository = new PrismaRidesRepository();
        const service = new CreateRegistrationService(
            prismaRegistrationRepository,
            prismaRidesRepository
        );

        const { registration } = await service.execute({ rideId, userId });

        return registration;
    }

    @Authorized()
    @Query(returns => [RideModel])
    async fetchRidesUserParticipatedIn(
        @Arg('data') data: FetchRidesUserParticipatedInInput
    ) {
        const { userId, page } = data;

        const prismaRepository = new PrismaRegistrationRepository();
        const service = new FetchRidesUserParticipatedInService(prismaRepository);

        const { rides } = await service.execute({ userId, page });

        return rides;
    }

    @Authorized()
    @Query(returns => [UserModel])
    async fetchUsersSubscribedToRide(
        @Arg('data') data: FetchUsersSubscribedToRideInput
    ) {
        const { rideId, page } = data;

        const prismaRepository = new PrismaRegistrationRepository();
        const service = new FetchUsersSubscribedToRideService(prismaRepository);

        const { users } = await service.execute({ rideId, page });

        return users;
    }
}