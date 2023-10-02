import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { FetchUsersSubscribedToRide } from "./fetch-users-subscribed-to-ride";
import { InMemoryRegistrationRepository } from "../../repositories/in-memory/in-memory-registration-repository";
import { InMemoryRidesRepository } from "../../repositories/in-memory/in-memory-rides-repository";

let inMemoryRidesRepository: InMemoryRidesRepository
let inMemoryRegistrationsRepository: InMemoryRegistrationRepository;
let sut: FetchUsersSubscribedToRide;

function registerMockedRide() {
    // MM/DD/YYYY
    const start_registration = '10/03/2023';
    const end_registration = '10/07/2023';

    const event_day = '10/10/2023';

    const newRideBaseData = {
        ride_id: 'ride-01',
        ride_name: 'New Ride',
        start_date: new Date(event_day),
        start_date_registration: new Date(start_registration),
        end_date_registration: new Date(end_registration),
        start_place: 'Start Ride Avenue',
        ride_city: 'Ride City',
        ride_uf: 'RS',
        creator_id: 'user-01',
        participants_limit: null,
        additional_information: null
    };

    inMemoryRidesRepository.rides.push(newRideBaseData);
}

function clearMockedRides() {
    inMemoryRidesRepository.rides = [];
}

describe('Fetch Users Subscribed to Ride', () => {
    beforeEach(() => {
        inMemoryRidesRepository = new InMemoryRidesRepository();

        inMemoryRegistrationsRepository = new InMemoryRegistrationRepository();
        sut = new FetchUsersSubscribedToRide(inMemoryRegistrationsRepository);

        registerMockedRide();
    })

    afterEach(() => {
        clearMockedRides();
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
})