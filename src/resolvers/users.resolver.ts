import { Query, Resolver } from "type-graphql";

@Resolver()
export class UserResolver {
    @Query(returns => String)
    async helloWorld() {
        return 'hello world';
    }
}