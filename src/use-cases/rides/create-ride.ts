import z from "zod";
import dayjs from "dayjs";

import { RidesRepository } from "../../repositories/rides-repository";
import { InvalidDatesError } from "../../errors/invalid-dates";

interface CreateRideUseCaseRequest {
    ride_name: string,
    start_date: Date,
    start_date_registration: Date
    end_date_registration: Date
    start_place: string
    ride_city: string,
    ride_uf: string

    additional_information?: string
    participants_limit?: number
}

export class CreateRideUseCase {
    constructor(private ridesRepository: RidesRepository) { }

    /* ======================== aux functions ===================== */
    private validateFields(fields: CreateRideUseCaseRequest) {
        const fieldsSchema = z.object({
            ride_name: z.string().max(50),
            start_date: z.date(),
            start_date_registration: z.date(),
            end_date_registration: z.date(),
            start_place: z.string().max(50),
            ride_city: z.string().max(30),
            ride_uf: z.string().length(2).toUpperCase(),

            additional_information: z.string().max(240).nullable().optional().default(null),
            participants_limit: z.coerce.number().min(1).max(250).nullable().optional().default(null),
        })

        const validatedFields = fieldsSchema.parse(fields);
        return validatedFields
    }

    private checkIfEndDayRegistrationIsAfterStartDayRegistration(startDay: Date, endDay: Date) {
        const formattedStartDay = dayjs(startDay);
        const formattedEndDay = dayjs(endDay);

        const isStartBeforeEnd = formattedStartDay.isBefore(formattedEndDay);
        return isStartBeforeEnd;
    }

    private checkIfRideStartDayIsAfterCreationDay(startDay: Date) {
        const rideDay = dayjs(startDay);
        const creationDay = dayjs(new Date());

        return rideDay.isAfter(creationDay);
    }

    /* ======================== main routine ===================== */
    async execute(newRideData: CreateRideUseCaseRequest) {
        const data = this.validateFields(newRideData);

        const {
            start_date_registration,
            end_date_registration,
            start_date
        } = newRideData;

        const isStartBeforeAnd = this.checkIfEndDayRegistrationIsAfterStartDayRegistration(
            start_date_registration,
            end_date_registration
        );

        if (!isStartBeforeAnd) throw new InvalidDatesError('start date must be earlier than end date');

        const isRideDayAfterToday = this.checkIfRideStartDayIsAfterCreationDay(start_date);

        if (!isRideDayAfterToday) throw new InvalidDatesError('ride day must be after the event creation date');

        const newRide = await this.ridesRepository.create(data);

        return {
            ride: newRide
        }
    }
}