import z from "zod";
import { RidesRepository } from "../../repositories/rides-repository";

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

    async execute(newRideData: CreateRideUseCaseRequest) {
        const data = this.validateFields(newRideData);

        const newRide = await this.ridesRepository.create(data);

        return {
            ride: newRide
        }
    }
}