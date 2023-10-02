import { beforeEach, describe, expect, it } from "vitest";

import { FetchRidesUserParticipatedInUseCase } from "./fetch-rides-user-participated-in";
import { InMemoryRegistrationRepository } from "../../repositories/in-memory/in-memory-registration-repository";

let inMemoryRegistrationsRepository: InMemoryRegistrationRepository;
let sut: FetchRidesUserParticipatedInUseCase;

describe('Fetch Rides A User Participated In', () => {
    beforeEach(() => {

        inMemoryRegistrationsRepository = new InMemoryRegistrationRepository();
        sut = new FetchRidesUserParticipatedInUseCase(inMemoryRegistrationsRepository);
    })

    it('should fetch the rides a user registered to', async () => {
        await inMemoryRegistrationsRepository.create({
            user_id: 'user-01',
            ride_id: 'ride-01'
        })

        await inMemoryRegistrationsRepository.create({
            user_id: 'user-01',
            ride_id: 'ride-02'
        })

        const { rides } = await sut.execute({ userId: 'user-01' });

        expect(rides).toHaveLength(2);
    })

    it('should not fetch rides the user did not register to', async () => {
        await inMemoryRegistrationsRepository.create({
            user_id: 'user-01',
            ride_id: 'ride-01'
        })

        await inMemoryRegistrationsRepository.create({
            user_id: 'user-01',
            ride_id: 'ride-02'
        })

        await inMemoryRegistrationsRepository.create({
            user_id: 'user-02',
            ride_id: 'ride-03'
        })

        const { rides } = await sut.execute({ userId: 'user-01' });

        expect(rides).toHaveLength(2);
    })

    it('should limit to 15 rides per page (page 1)', async () => {
        for (let i = 1; i <= 20; i++) {
            await inMemoryRegistrationsRepository.create({
                user_id: 'user-01',
                ride_id: `ride-${i}`
            })
        }

        const { rides } = await sut.execute({ userId: 'user-01' });

        expect(rides).toHaveLength(15);
    })

    it('should limit to 15 rides per page (page 2)', async () => {
        for (let i = 1; i <= 20; i++) {
            await inMemoryRegistrationsRepository.create({
                user_id: 'user-01',
                ride_id: `ride-${i}`
            })
        }

        const { rides } = await sut.execute({ userId: 'user-01', page: 2 });

        expect(rides).toHaveLength(5);
    })
})