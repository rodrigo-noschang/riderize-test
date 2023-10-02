import { beforeEach, describe, expect, it } from "vitest";

import { FetchUsersSubscribedToRideUseCase } from "./fetch-users-subscribed-to-ride";
import { InMemoryRegistrationRepository } from "../../repositories/in-memory/in-memory-registration-repository";

let inMemoryRegistrationsRepository: InMemoryRegistrationRepository;
let sut: FetchUsersSubscribedToRideUseCase;

describe('Fetch Users Subscribed to Ride', () => {
    beforeEach(() => {

        inMemoryRegistrationsRepository = new InMemoryRegistrationRepository();
        sut = new FetchUsersSubscribedToRideUseCase(inMemoryRegistrationsRepository);
    })

    it('should be able to fetch users registered to a ride', async () => {
        await inMemoryRegistrationsRepository.create({
            user_id: 'user-01',
            ride_id: 'ride-01'
        })

        await inMemoryRegistrationsRepository.create({
            user_id: 'user-02',
            ride_id: 'ride-01'
        })

        const { users } = await sut.execute({ rideId: 'ride-01' });

        expect(users).toHaveLength(2);
    })

    it('should not fetch users registered in a different ride', async () => {
        await inMemoryRegistrationsRepository.create({
            user_id: 'user-01',
            ride_id: 'ride-01'
        })

        await inMemoryRegistrationsRepository.create({
            user_id: 'user-02',
            ride_id: 'ride-01'
        })

        await inMemoryRegistrationsRepository.create({
            user_id: 'user-03',
            ride_id: 'ride-02'
        })

        const { users } = await sut.execute({ rideId: 'ride-01' });

        expect(users).toHaveLength(2);
    })

    it('should limit to 15 users per page (page 1)', async () => {
        for (let i = 1; i <= 20; i++) {
            await inMemoryRegistrationsRepository.create({
                user_id: `user-${i}`,
                ride_id: 'ride-01'
            })
        }

        const { users } = await sut.execute({ rideId: 'ride-01' });

        expect(users).toHaveLength(15);
    })

    it('should limit to 15 users per page (page 2)', async () => {
        for (let i = 1; i <= 20; i++) {
            await inMemoryRegistrationsRepository.create({
                user_id: `user-${i}`,
                ride_id: 'ride-01'
            })
        }

        const { users } = await sut.execute({ rideId: 'ride-01', page: 2 });

        expect(users).toHaveLength(5);
    })
})