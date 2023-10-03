import { beforeEach, describe, expect, it } from 'vitest';

import { RegisterUserService } from './register-user';
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-users-repository';

import { UniqueFieldConstraintError } from '../../errors/unique-field-constraint';

let inMemoryRepository: InMemoryUserRepository;
let sut: RegisterUserService

describe('Register Use Case', () => {
    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new RegisterUserService(inMemoryRepository);
    })

    it('should be able to register a new user', async () => {
        const newUserBaseData = {
            user_name: 'New User',
            email: 'new_user@mail.com',
            password: '12345678'
        }

        const { user } = await sut.execute(newUserBaseData);

        expect(user.user_id).toEqual(expect.any(String));
    })

    it('should hash password before saving', async () => {
        const newUserBaseData = {
            user_name: 'New User',
            email: 'new_user@mail.com',
            password: '12345678'
        }

        const { user } = await sut.execute(newUserBaseData);

        expect(user.password_hash).toEqual(expect.any(String));
        expect(user.password_hash).not.toBe('12345678');
    })

    it('should not register the same email for 2 different users', async () => {
        const firstUser = {
            user_name: 'First User',
            email: 'new_email@mail.com',
            password: '12345678'
        }

        const secondUser = {
            user_name: 'Second User',
            email: 'new_email@mail.com',
            password: '12345678'
        }

        await sut.execute(firstUser);

        await expect(() => {
            return sut.execute(secondUser)
        }).rejects.toBeInstanceOf(UniqueFieldConstraintError);
    })

    it('should not register the same phone for 2 different users', async () => {
        const firstUser = {
            user_name: 'First User',
            email: 'first_email@mail.com',
            password: '12345678',
            phone: '44999999999'
        }

        const secondUser = {
            user_name: 'Second User',
            email: 'second_email@mail.com',
            password: '12345678',
            phone: '44999999999'
        }

        await sut.execute(firstUser);

        await expect(() => {
            return sut.execute(secondUser)
        }).rejects.toBeInstanceOf(UniqueFieldConstraintError);
    })
})