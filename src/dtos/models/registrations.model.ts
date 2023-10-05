import { Field, ObjectType } from "type-graphql";

import { RideModel } from "./rides.model";
import { UserModel } from "./users.model";

@ObjectType()
export class RegistrationModel {
    @Field()
    registration_id: string;

    @Field()
    subscription_date: Date;

    @Field()
    ride: RideModel

    @Field()
    user: UserModel;
}