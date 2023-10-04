import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';

import path from 'node:path';
import { UserResolver } from './src/resolvers/users.resolver';
import { extractTokenFromStringObject, getUserNameFromToken } from './src/utils/token-related';

async function main() {
    const schema = await buildSchema({
        resolvers: [UserResolver],
        emitSchemaFile: path.resolve(__dirname, 'src', 'schema', 'schema.gql'),
        authChecker: ({ context }) => {
            const stringObject = context;

            const token = extractTokenFromStringObject(stringObject);
            if (!token) return false;

            const tokenData = getUserNameFromToken(token);

            const { user } = tokenData as any;

            return !!user;
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
            const data = req.headers.authorization;
            return data;
        }
    })

    console.log(`Server running on ${url}`);
}

main();