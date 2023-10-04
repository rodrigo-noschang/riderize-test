import { ZodError } from "zod";
import { GraphQLError } from "graphql";
import { Arg, Mutation, Query, Resolver, Authorized, Ctx } from "type-graphql";

import { RegisterUserService } from "../services/users/register-user";
import { AuthenticateUserService } from "../services/users/authenticate";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";

import {
    AuthenticateUser,
    UserModel
} from "../dtos/models/users.model";

import {
    RegisterUserInput,
    AuthenticateUserInput
} from "../dtos/inputs/users.inputs";

import { UniqueFieldConstraintError } from "../errors/unique-field-constraint";
import { generateTokenWithUserId } from "../utils/token-related";
import { InvalidCredentialsError } from "../errors/invalid-credentials";

interface Context {
    userId: string
}

@Resolver()
export class UserResolver {
    @Query(returns => [UserModel])
    async users() {
        return [];
    }

    @Authorized()
    @Query(() => String)
    async tryToken(
        @Ctx() ctx: Context
    ) {
        return `Access granted to ${ctx.userId}`;
    }

    @Mutation(() => UserModel)
    async registerUser(
        @Arg('data') data: RegisterUserInput
    ) {
        try {
            const prismaRepository = new PrismaUsersRepository();
            const service = new RegisterUserService(prismaRepository);

            const { user } = await service.execute(data);

            return user;

        } catch (error) {
            let errorMessage = '';
            let errorType = '';

            if (error instanceof ZodError) {
                errorMessage = JSON.stringify(error.format());
                errorType = 'FIELD_VALIDATION';
            }

            if (error instanceof UniqueFieldConstraintError) {
                errorMessage = error.message;
                errorType = error.type
            }

            throw new GraphQLError(errorMessage, {
                extensions: {
                    errorType
                }
            });
        }
    }

    @Mutation(() => AuthenticateUser)
    async authenticateUser(
        @Arg('data') data: AuthenticateUserInput
    ) {
        try {
            const prismaRepository = new PrismaUsersRepository()
            const service = new AuthenticateUserService(prismaRepository)

            const { user } = await service.execute({
                email: data.email,
                password: data.password
            })

            const token = generateTokenWithUserId(user.user_id);

            return {
                token
            };
        } catch (error) {
            let errorMessage = '';
            let errorType = '';

            if (error instanceof ZodError) {
                errorMessage = JSON.stringify(error.format());
                errorType = 'FIELD_VALIDATION';
            }

            if (error instanceof InvalidCredentialsError) {
                errorMessage = error.message;
                errorType = error.type
            }

            throw new GraphQLError(errorMessage, {
                extensions: {
                    errorType
                }
            });
        }

    }
}