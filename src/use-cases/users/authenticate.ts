import z from 'zod';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

import { UsersRepository } from "../../repositories/users-repository";

import { InvalidCredentialsError } from "../../errors/invalid-credentials";

interface AuthenticateUserUseCaseRequest {
    email: string,
    password: string
}

interface AuthenticateUserUseCaseResponse {
    user: User
}

export class AuthenticateUserUseCase {
    constructor(private usersRepository: UsersRepository) { }

    /* ============================ aux functions ===================== */
    private validateFields(fields: AuthenticateUserUseCaseRequest) {
        const fieldsSchema = z.object({
            email: z.string().email(),
            password: z.string().min(8)
        })

        fieldsSchema.parse(fields);
    }

    private async checkIfEmailIsRegistered(email: string) {
        const registeredEmail = await this.usersRepository.findUniqueUserByEmail(email);
        return registeredEmail;
    }

    private async checkIfPasswordsMatch(password: string, userHashedPassword: string) {
        const passwordsMatch = await bcrypt.compare(password, userHashedPassword);
        return passwordsMatch;
    }

    /* =========================== main routine ======================== */
    async execute({ email, password }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse | null> {
        this.validateFields({ email, password });

        const existingUser = await this.checkIfEmailIsRegistered(email);
        if (!existingUser) throw new InvalidCredentialsError();

        const passwordMatch = await this.checkIfPasswordsMatch(password, existingUser.password_hash);
        if (!passwordMatch) throw new InvalidCredentialsError();

        return {
            user: existingUser
        }
    }
}