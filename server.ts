import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';

import path from 'node:path';
import { UserResolver } from './src/resolvers/users.resolver';

async function main() {
    const schema = await buildSchema({
        resolvers: [UserResolver],
        emitSchemaFile: path.resolve(__dirname, 'src', 'schema', 'schema.gql')
    });

    const server = new ApolloServer({
        schema,
    })

    const { url } = await startStandaloneServer(server, {
        listen: {
            port: 4000
        }
    })

    console.log(`Server running on ${url}`);
}

main();