import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { buildSchema, Resolver, Query, ObjectType, Field, ID } from "type-graphql";



// Creating a simple GraphQL API with TypeGraphQL and Apollo Server

// An object type which defines the class Dog with a name which also doubles as its ID
@ObjectType() 
export class Dog {
    @Field(() => ID)
    name!: string;
}

// A resolver which resolves the query dogs() which returns an array of Dog objects
@Resolver(Dog)
export class DogResolver {
    @Query(() => [Dog])
    dogs(): Dog[] {
        return [{name: "Buster"}, {name: "Molly"}]
    }
}

// Building the schema with the DogResolver (note: we must await the buildSchema method)
const schema = await buildSchema({
    resolvers: [DogResolver],
});


// initializing the Apollo Server with the schema
const server = new ApolloServer({schema});

// Disabling the body parser for the API route
export const config = {
    api: {
        bodyParser: false,
    }
}

// as opposed to v3, v4 of @apollo/server does not support the createHandler method anymore, 
// so using the @as-integrations/next package, we can start our server and create a Next.js API route handler all-in-one

export default startServerAndCreateNextHandler(server);
