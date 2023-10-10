import { ZodError } from "zod";
import { GraphQLError } from "graphql";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { RideModel } from "../dtos/models/rides.model";
import { UserModel } from "../dtos/models/users.model";
import { DeleteRegistrationReturn, RegistrationModel } from "../dtos/models/registrations.model";
import { CreateRegistrationInput, DeleteRegistrationInput, FetchRidesUserParticipatedInInput, FetchUsersSubscribedToRideInput } from "../dtos/inputs/registrations.input";

import { AuthContext } from "../utils/token-related";
import { PrismaRidesRepository } from "../repositories/prisma/prisma-rides-repository";
import { CreateRegistrationService } from "../services/registration/create-registration";
import { DeleteRegistrationService } from "../services/registration/delete-registration";
import { MustBeRegisteredToRideError } from "../services/registration/must-be-registered-to-ride";
import { PrismaRegistrationRepository } from "../repositories/prisma/prisma-registration-repository";
import { FetchUsersSubscribedToRideService } from "../services/registration/fetch-users-subscribed-to-ride";
import { FetchRidesUserParticipatedInService } from "../services/registration/fetch-rides-user-participated-in";

import { InvalidDatesError } from "../errors/invalid-dates";
import { InstanceNotFoundError } from "../errors/instance-not-found";
import { AlreadyRegisteredError } from "../errors/already-registered";
import { UnableToRegisterErrorUserToRideError } from "../errors/unable-to-register";
import { RideCreatorCanNotRegisterError } from "../errors/ride-creator-can-not-register";
import { ReachedParticipantsLimitError } from "../errors/participants-limit-reached";


@Resolver()
export class RegistrationsResolver {

    @Authorized()
    @Mutation(returns => RegistrationModel)
    async registerToARide(
        @Arg('data') data: CreateRegistrationInput,
        @Ctx() ctx: AuthContext
    ) {
        try {
            const { userId } = ctx;
            const { rideId } = data;

            const prismaRegistrationRepository = new PrismaRegistrationRepository();
            const prismaRidesRepository = new PrismaRidesRepository();

            const service = new CreateRegistrationService(
                prismaRegistrationRepository,
                prismaRidesRepository
            );

            const { registration } = await service.execute({ rideId, userId });

            if (!registration) throw new UnableToRegisterErrorUserToRideError();;

            return registration;

        } catch (error) {
            let errorMessage = '';
            let errorType = '';

            if (error instanceof ZodError) {
                errorMessage = JSON.stringify(error.format());
                errorType = 'FIELD_VALIDATION';
            }

            if (
                error instanceof InvalidDatesError ||
                error instanceof InstanceNotFoundError ||
                error instanceof AlreadyRegisteredError ||
                error instanceof ReachedParticipantsLimitError ||
                error instanceof RideCreatorCanNotRegisterError ||
                error instanceof UnableToRegisterErrorUserToRideError
            ) {
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
    async fetchRidesUserParticipatedIn(
        @Arg('data') data: FetchRidesUserParticipatedInInput
    ) {
        try {
            const { userId, page } = data;

            const prismaRepository = new PrismaRegistrationRepository();
            const service = new FetchRidesUserParticipatedInService(prismaRepository);

            const { rides } = await service.execute({ userId, page });

            return rides;

        } catch (error) {
            let errorMessage = '';
            let errorType = '';

            if (error instanceof ZodError) {
                errorMessage = JSON.stringify(error.format());
                errorType = 'FIELD_VALIDATION';
            }

            throw new GraphQLError(errorMessage, {
                extensions: {
                    errorType
                }
            });
        }

    }

    @Authorized()
    @Query(returns => [UserModel])
    async fetchUsersSubscribedToRide(
        @Arg('data') data: FetchUsersSubscribedToRideInput
    ) {
        try {
            const { rideId, page } = data;

            const prismaRepository = new PrismaRegistrationRepository();
            const service = new FetchUsersSubscribedToRideService(prismaRepository);

            const { users } = await service.execute({ rideId, page });

            return users;

        } catch (error) {
            let errorMessage = '';
            let errorType = '';

            if (error instanceof ZodError) {
                errorMessage = JSON.stringify(error.format());
                errorType = 'FIELD_VALIDATION';
            }

            throw new GraphQLError(errorMessage, {
                extensions: {
                    errorType
                }
            });
        }
    }

    @Authorized()
    @Mutation(returns => DeleteRegistrationReturn)
    async deleteRegistration(
        @Ctx() ctx: AuthContext,
        @Arg('data') data: DeleteRegistrationInput
    ) {
        try {
            const { userId } = ctx;
            const { rideId } = data;

            const prismaRidesRepository = new PrismaRidesRepository();
            const prismaRegistrationRepository = new PrismaRegistrationRepository();
            const service = new DeleteRegistrationService(prismaRidesRepository, prismaRegistrationRepository);

            const deletedRegistrationId = await service.execute({ rideId, userId })

            return {
                registration_id: deletedRegistrationId
            };

        } catch (error) {
            let errorMessage = '';
            let errorType = '';

            console.log(error);

            if (error instanceof ZodError) {
                errorMessage = JSON.stringify(error.format());
                errorType = 'FIELD_VALIDATION';
            }

            if (
                error instanceof InstanceNotFoundError ||
                error instanceof MustBeRegisteredToRideError
            ) {
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
}