// lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache({
    typePolicies: {
      Work: {
        fields: {
          workCategories: {
            merge: false // Don't merge, replace entirely
          }
        }
      }
    }
  }),
});

export default client;
