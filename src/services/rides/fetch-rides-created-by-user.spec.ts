import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryRidesRepository } from "../../repositories/in-memory/in-memory-rides-repository";
import { FetchRidesCreatedByUserService } from "./fetch-rides-created-by-user";

let inMemoryRidesRepository: InMemoryRidesRepository;
let sut: FetchRidesCreatedByUserService;

describe('Fetch Rides Created By User', () => {
    beforeEach(() => {
        inMemoryRidesRepository = new InMemoryRidesRepository();
        sut = new FetchRidesCreatedByUserService(inMemoryRidesRepository);
    })

    it('should fetch rides created by user', async () => {
        const newRideBaseData = {
            ride_name: 'New Ride',
            start_date: new Date(),
            start_date_registration: new Date(),
            end_date_registration: new Date(),
            start_place: 'Start Ride Avenue',
            ride_city: 'Ride City',
            ride_uf: 'RS',
            creator_id: 'user-01'
        };

        await inMemoryRidesRepository.create(newRideBaseData);
        await inMemoryRidesRepository.create(newRideBaseData);

        const { rides } = await sut.execute({ userId: 'user-01' });

        expect(rides).toHaveLength(2);
    })

    it('should not fetch rides created by other users', async () => {
        const ownRide = {
            ride_name: 'New Ride',
            start_date: new Date(),
            start_date_registration: new Date(),
            end_date_registration: new Date(),
            start_place: 'Start Ride Avenue',
            ride_city: 'Ride City',
            ride_uf: 'RS',
            creator_id: 'user-01'
        };

        const differentRide = {
            ...ownRide,
            creator_id: 'user-02'
        }

        await inMemoryRidesRepository.create(ownRide);
        await inMemoryRidesRepository.create(ownRide);
        await inMemoryRidesRepository.create(differentRide);

        const { rides } = await sut.execute({ userId: 'user-01' });

        expect(rides).toHaveLength(2);
    })
})