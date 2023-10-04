import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterUserInput {
    @Field()
    user_name: string;

    @Field(type => String)
    email: string;

    @Field(type => String)
    password: string;

    @Field(type => String, { nullable: true })
    phone?: string;

    @Field(type => String, { nullable: true })
    user_city?: string;

    @Field(type => String, { nullable: true })
    user_uf?: string;
}

@InputType()
export class AuthenticateUserInput {
    @Field()
    email: string;

    @Field()
    password: string;
}