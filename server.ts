import { gql, ApolloServer } from 'apollo-server';

const typeDefs = gql`
    type Query {
        helloWorld: String!
    }

    type Mutation {
        createUser(name: String): String!
    }
`;



const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query: {
            helloWorld: () => {
                return 'Hello World'
            }
        },
        Mutation: {
            createUser: (parent, args, ctx) => {
                console.log(args);

                return 'John Doe';
            }
        }
    }
});

server.listen().then(({ url }) => console.log(`Server running on ${url}`));