import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterRideInput {
    @Field()
    ride_name: string

    @Field()
    start_date: Date

    @Field()
    start_date_registration: Date

    @Field()
    end_date_registration: Date

    @Field()
    ride_city: string

    @Field()
    ride_uf: string

    @Field({ nullable: true })
    additional_information?: string

    @Field()
    start_place: string

    @Field({ nullable: true })
    participants_limit?: number
}

@InputType()
export class FetchRidesCreatedByUserInput {
    @Field()
    userId: string

    @Field({ nullable: true, defaultValue: 1 })
    page?: number
}

@InputType()
export class FetchRidesInput {
    @Field({ nullable: true, defaultValue: 1 })
    page?: number
}