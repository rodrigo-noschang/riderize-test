import z from 'zod';
import bcrypt from 'bcrypt';

import { UsersRepository } from "../../repositories/users-repository";
import { UniqueFieldConstraintError } from '../../errors/unique-field-constraint';

interface RegisterUserServiceRequest {
    user_name: string
    email: string
    password: string

    phone?: string
    user_city?: string
    user_uf?: string
}

export class RegisterUserService {
    constructor(private usersRepository: UsersRepository) { }

    /* =========================== aux functions ============================= */
    private validateFields(fields: RegisterUserServiceRequest) {
        const fieldsSchema = z.object({
            user_name: z.string().max(50),
            email: z.string().email(),
            password: z.string().min(8),

            phone: z.string().length(11).optional(),
            user_city: z.string().length(50).optional(),
            user_uf: z.string().length(2).toUpperCase().optional()
        })

        fieldsSchema.parse(fields);
    }

    private async checkIfEmailIsAvailable(email: string) {
        const emailAlreadyRegistered = await this.usersRepository.findUniqueUserByEmail(email);

        if (emailAlreadyRegistered) throw new UniqueFieldConstraintError('email');
    }

    private async checkIfPhoneIsAvailable(phone: string) {
        const phoneAlreadyRegistered = await this.usersRepository.findUniqueUserByPhone(phone);

        if (phoneAlreadyRegistered) throw new UniqueFieldConstraintError('phone');
    }

    private async hashPassword(password: string) {
        const hashedPassword = await bcrypt.hash(password, 6);
        return hashedPassword;
    }

    /* ================================== main routine ================================== */
    async execute(newUserData: RegisterUserServiceRequest) {
        this.validateFields(newUserData);

        await this.checkIfEmailIsAvailable(newUserData.email);

        if (newUserData.phone) {
            await this.checkIfPhoneIsAvailable(newUserData.phone);
        }

        const password_hash = await this.hashPassword(newUserData.password);

        const createdUser = await this.usersRepository.create({
            ...newUserData,
            password_hash,
        });

        return {
            user: createdUser
        }
    }
}