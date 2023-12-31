import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InvalidDatesError } from "../../errors/invalid-dates";
import { RideCreatorCanNotRegisterError } from "../../errors/ride-creator-can-not-register";

import { CreateRegistrationService } from "./create-registration";
import { InMemoryRidesRepository } from "../../repositories/in-memory/in-memory-rides-repository";
import { InMemoryRegistrationRepository } from "../../repositories/in-memory/in-memory-registration-repository";
import { Registration } from "@prisma/client";

let inMemoryRegistrationRepository: InMemoryRegistrationRepository;
let inMemoryRidesRepository: InMemoryRidesRepository;
let sut: CreateRegistrationService

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

describe('Create Registration Use Case', () => {
    beforeEach(() => {
        inMemoryRegistrationRepository = new InMemoryRegistrationRepository();
        inMemoryRidesRepository = new InMemoryRidesRepository();
        sut = new CreateRegistrationService(inMemoryRegistrationRepository, inMemoryRidesRepository);

        vi.useFakeTimers();

        registerMockedRide();
    })

    afterEach(() => {
        vi.useRealTimers();

        clearMockedRides();
    })

    it('should be able to register a user to a ride', async () => {
        const inRegistrationPeriodDate = new Date('10/05/2023');
        vi.setSystemTime(inRegistrationPeriodDate);

        const response = await sut.execute({
            rideId: 'ride-01',
            userId: 'user-02'
        });

        const registration = response.registration as Registration;

        expect(registration.user_id).toEqual(expect.any(String));
        expect(registration.ride_id).toEqual(expect.any(String));
    })

    it('should not be able to register to a ride when not in Registration Period', async () => {
        const outOfRegistrationPeriodDate = new Date('10/10/2023');
        vi.setSystemTime(outOfRegistrationPeriodDate);

        await expect(() => {
            return sut.execute({
                rideId: 'ride-01',
                userId: 'user-02'
            });
        }).rejects.toBeInstanceOf(InvalidDatesError);
    })

    it('should be able to register to a ride on registration end date', async () => {
        const registrationEndDate = new Date('10/07/2023');
        vi.setSystemTime(registrationEndDate);

        const response = await sut.execute({
            rideId: 'ride-01',
            userId: 'user-02'
        });

        const registration = response.registration as Registration;

        expect(registration.user_id).toEqual(expect.any(String));
        expect(registration.ride_id).toEqual(expect.any(String));
    })

    it('should be able to register to a ride on registration start date', async () => {
        const registrationStartDate = new Date('10/03/2023');
        vi.setSystemTime(registrationStartDate);

        const response = await sut.execute({
            rideId: 'ride-01',
            userId: 'user-02'
        });

        const registration = response.registration as Registration;

        expect(registration.user_id).toEqual(expect.any(String));
        expect(registration.ride_id).toEqual(expect.any(String));
    })

    it('should not be able to register to a ride created by himself', async () => {
        const inRegistrationPeriodDate = new Date('10/05/2023');
        vi.setSystemTime(inRegistrationPeriodDate);

        await expect(() => {
            return sut.execute({
                rideId: 'ride-01',
                userId: 'user-01'
            })
        }).rejects.toBeInstanceOf(RideCreatorCanNotRegisterError);
    })
})