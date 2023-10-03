import bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it } from "vitest";

import { AuthenticateUserService } from "./authenticate";
import { InMemoryUserRepository } from "../../repositories/in-memory/in-memory-users-repository";

import { InvalidCredentialsError } from "../../errors/invalid-credentials";

let inMemoryRepository: InMemoryUserRepository;
let sut: AuthenticateUserService

describe('Authenticate User Use Case', () => {
    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new AuthenticateUserService(inMemoryRepository);
    })

    it('should be able to authenticate user', async () => {
        const email = 'new_email@mail.com';
        const password_hash = await bcrypt.hash('123123123', 6);

        await inMemoryRepository.create({
            email,
            password_hash,
            user_name: 'New user'
        })

        const response = await sut.execute({
            email,
            password: '123123123'
        });

        expect(response?.user.user_id).toEqual(expect.any(String));
    })

    it('should not be able to authenticate with a non-registered email', async () => {
        await expect(() => {
            return sut.execute({
                email: 'non_registered_email@mail.com',
                password: '12345678'
            })
        }).rejects.toBeInstanceOf(InvalidCredentialsError);
    })

    it('should not be able to authenticate with wrong password', async () => {
        const email = 'new_email@mail.com';
        const password_hash = await bcrypt.hash('123123123', 6);

        await inMemoryRepository.create({
            email,
            password_hash,
            user_name: 'New user'
        })

        await expect(() => {
            return sut.execute({
                email,
                password: '11111111'
            });
        }).rejects.toBeInstanceOf(InvalidCredentialsError);
    })
})