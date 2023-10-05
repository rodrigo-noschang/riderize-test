import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class RideModel {
    @Field(type => ID)
    ride_id: string;

    @Field()
    ride_name: string;

    @Field()
    start_date: Date;

    @Field()
    start_date_registration: Date;

    @Field()
    end_date_registration: Date;

    @Field()
    ride_city: string;

    @Field()
    ride_uf: string;

    @Field({ nullable: true })
    additional_information?: string;

    @Field()
    start_place: string;

    @Field({ nullable: true })
    participants_limit?: number;

    @Field()
    creator_id: string;
}