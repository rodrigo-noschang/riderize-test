import 'reflect-metadata';

import path from 'node:path';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { UserResolver } from './src/resolvers/users.resolver';
import { RidesResolver } from './src/resolvers/rides.resolver';
import { RegistrationsResolver } from './src/resolvers/registrations.resolver';

import { extractTokenFromStringObject, getUserNameFromToken } from './src/utils/token-related';

async function main() {
    const schema = await buildSchema({
        resolvers: [
            UserResolver,
            RidesResolver,
            RegistrationsResolver
        ],
        emitSchemaFile: path.resolve(__dirname, 'src', 'schema', 'schema.gql'),
        authChecker: ({ context }) => {
            const { userId } = context;

            return !!userId
        }
    });

    const server = new ApolloServer({
        schema,
    })

    const { url } = await startStandaloneServer(server, {
        listen: {
            port: 4000
        },
        context: ({ req }) => {
            const stringObject = req.headers.authorization;

            const token = extractTokenFromStringObject(stringObject);
            if (!token) return false;

            const tokenData = getUserNameFromToken(token);

            const { userId } = tokenData as any;

            return {
                userId
            }
        }
    })

    console.log(`Server running on ${url}`);
}

main();