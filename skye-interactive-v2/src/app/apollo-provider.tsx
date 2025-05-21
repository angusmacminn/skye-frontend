'use client';

import { ApolloProvider } from "@apollo/client";
import client from "./lib/apolloClient"; // Assuming your client is at src/lib/apolloClient.ts
                                        // and you have import alias "@/*" for "src/*"

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
