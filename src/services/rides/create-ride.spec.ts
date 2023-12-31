import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import dayjs from "dayjs";

import { CreateRideService } from "./create-ride";
import { InMemoryRidesRepository } from "../../repositories/in-memory/in-memory-rides-repository";

import { InvalidDatesError } from "../../errors/invalid-dates";

let inMemoryRidesRepository: InMemoryRidesRepository
let sut: CreateRideService

describe('Create Ride Use Case', () => {
    beforeEach(() => {
        inMemoryRidesRepository = new InMemoryRidesRepository();
        sut = new CreateRideService(inMemoryRidesRepository);

        vi.useFakeTimers();

        vi.setSystemTime(new Date('09/20/2023'))
    })

    afterEach(() => {
        vi.useRealTimers();
    })

    it('should be able to create new Ride', async () => {
        // MM/DD/YYYY
        const start_registration = '10/01/2023';
        const end_registration = '10/02/2023';
        const rideDay = '10/10/2023';

        const newRideBaseData = {
            ride_name: 'New Ride',
            start_date: new Date(rideDay),
            start_date_registration: new Date(start_registration),
            end_date_registration: new Date(end_registration),
            start_place: 'Start Ride Avenue',
            ride_city: 'Ride City',
            ride_uf: 'RS',
            creator_id: 'user-01'
        };

        const { ride } = await sut.execute(newRideBaseData);

        expect(ride.ride_id).toEqual(expect.any(String));
    })

    it('should not allow end_date_registration to be earlier than start_date_registration', async () => {
        // MM/DD/YYYY
        const start_registration = '10/05/2023';
        const end_registration = '10/02/2023';
        const rideDay = '10/10/2023';

        const newRideBaseData = {
            ride_name: 'New Ride',
            start_date: new Date(rideDay),
            start_date_registration: new Date(start_registration),
            end_date_registration: new Date(end_registration),
            start_place: 'Start Ride Avenue',
            ride_city: 'Ride City',
            ride_uf: 'RS',
            creator_id: 'user-01'
        };

        await expect(() => {
            return sut.execute(newRideBaseData);
        }).rejects.toBeInstanceOf(InvalidDatesError);
    })

    it('should not allow start_date to be earlier than today', async () => {
        // MM/DD/YYYY
        const start_registration = '10/01/2023';
        const end_registration = '10/05/2023';

        const today = dayjs();
        const rideDay = today.subtract(1, 'day').toDate();

        const newRideBaseData = {
            ride_name: 'New Ride',
            start_date: rideDay,
            start_date_registration: new Date(start_registration),
            end_date_registration: new Date(end_registration),
            start_place: 'Start Ride Avenue',
            ride_city: 'Ride City',
            ride_uf: 'RS',
            creator_id: 'user-01'
        };

        await expect(() => {
            return sut.execute(newRideBaseData);
        }).rejects.toBeInstanceOf(InvalidDatesError);
    })
})