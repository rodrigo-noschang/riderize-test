import { beforeEach, describe, expect, it } from "vitest";

import { FetchRidesService } from "./fetch-rides";
import { InMemoryRidesRepository } from "../../repositories/in-memory/in-memory-rides-repository";


let inMemoryRidesRepository: InMemoryRidesRepository
let sut: FetchRidesService

describe('Fetch Rides Use Case', () => {
    beforeEach(() => {
        inMemoryRidesRepository = new InMemoryRidesRepository();
        sut = new FetchRidesService(inMemoryRidesRepository);
    })

    it('should be able to fetch registered Rides', async () => {
        // MM/DD/YYYY
        const today = '10/01/2023';
        const tomorrow = '10/02/2023';

        const newRideBaseData = {
            ride_name: 'New Ride',
            start_date: new Date(),
            start_date_registration: new Date(today),
            end_date_registration: new Date(tomorrow),
            start_place: 'Start Ride Avenue',
            ride_city: 'Ride City',
            ride_uf: 'RS',
            creator_id: 'user-01'
        };

        inMemoryRidesRepository.create(newRideBaseData);

        const { rides } = await sut.execute({ page: 1 });

        expect(rides).toHaveLength(1);
    })

    it('should paginate rides by 15 (first page)', async () => {
        // MM/DD/YYYY
        const today = '10/01/2023';
        const tomorrow = '10/02/2023';

        for (let i = 1; i <= 20; i++) {
            const newRideBaseData = {
                ride_name: `New Ride ${i}`,
                start_date: new Date(),
                start_date_registration: new Date(today),
                end_date_registration: new Date(tomorrow),
                start_place: 'Start Ride Avenue',
                ride_city: 'Ride City',
                ride_uf: 'RS',
                creator_id: 'user-01'

            };

            inMemoryRidesRepository.create(newRideBaseData);
        }

        const { rides } = await sut.execute({ page: 1 });

        expect(rides).toHaveLength(15);
    })

    it('should paginate rides by 15 (second page)', async () => {
        // MM/DD/YYYY
        const today = '10/01/2023';
        const tomorrow = '10/02/2023';

        for (let i = 1; i <= 20; i++) {
            const newRideBaseData = {
                ride_name: `New Ride ${i}`,
                start_date: new Date(),
                start_date_registration: new Date(today),
                end_date_registration: new Date(tomorrow),
                start_place: 'Start Ride Avenue',
                ride_city: 'Ride City',
                ride_uf: 'RS',
                creator_id: 'user-01'
            };

            inMemoryRidesRepository.create(newRideBaseData);
        }

        const { rides } = await sut.execute({ page: 2 });

        expect(rides).toHaveLength(5);
    })
})