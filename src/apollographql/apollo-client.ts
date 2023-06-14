import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";
// "https://messenger-app-server.herokuapp.com/graphql"; http://localhost:4000/graphql

const httpLink = new HttpLink({
  uri: "https://messenger-app-server.herokuapp.com/graphql",
  credentials: "include",
});

const wsLink =
  typeof window !== "undefined" // checking if is is SSR or the actual window
    ? new GraphQLWsLink(
        createClient({
          url: "ws://messenger-app-server.herokuapp.com/graphql/subscriptions",
          connectionParams: async () => ({
            session: await getSession(),
          }),
        })
      )
    : null; // If it is NExtJs server, sockets are not available

const link =
  typeof window !== "undefined" && wsLink != null // it is not on NextJS server, create web socket link
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
