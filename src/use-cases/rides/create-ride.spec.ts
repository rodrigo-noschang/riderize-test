import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryRidesRepository } from "../../repositories/in-memory/in-memory-rides-repository";
import { CreateRideUseCase } from "./create-ride";

let inMemoryRidesRepository: InMemoryRidesRepository
let sut: CreateRideUseCase

describe('Create Ride Use Case', () => {
    beforeEach(() => {
        inMemoryRidesRepository = new InMemoryRidesRepository();
        sut = new CreateRideUseCase(inMemoryRidesRepository);
    })

    it('should be able to create new Ride', async () => {
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
            ride_uf: 'RS'
        };

        const { ride } = await sut.execute(newRideBaseData);

        expect(ride.ride_id).toEqual(expect.any(String));
    })
})