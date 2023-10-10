import { Field, InputType } from "type-graphql";

@InputType()
export class CreateRegistrationInput {
    @Field()
    rideId: string
}

@InputType()
export class FetchRidesUserParticipatedInInput {
    @Field()
    userId: string

    @Field({ nullable: true, defaultValue: 1 })
    page?: number
}

@InputType()
export class FetchUsersSubscribedToRideInput {
    @Field()
    rideId: string

    @Field({ nullable: true, defaultValue: 1 })
    page?: number
}

@InputType()
export class DeleteRegistrationInput {
    @Field()
    rideId: string
}