import { Field, ID, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class UserModel {
    @Field(type => ID)
    user_id: string;

    @Field(type => String)
    user_name: string;

    @Field(type => String)
    email: string;

    @Field(type => String)
    password_hash: string;

    @Field(type => String, { nullable: true })
    phone?: string;

    @Field(type => String, { nullable: true })
    user_city?: string;

    @Field(type => String, { nullable: true })
    user_uf?: string;
}

@ObjectType()
export class AuthenticateUser {
    @Field()
    token: string
}