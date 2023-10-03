import z from 'zod';
import bcrypt from 'bcrypt';

import { UsersRepository } from "../../repositories/users-repository";

import { InvalidCredentialsError } from "../../errors/invalid-credentials";

interface AuthenticateUserServiceRequest {
    email: string,
    password: string
}

export class AuthenticateUserService {
    constructor(private usersRepository: UsersRepository) { }

    /* ============================ aux functions ===================== */
    private validateFields(fields: AuthenticateUserServiceRequest) {
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
    async execute({ email, password }: AuthenticateUserServiceRequest) {
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