import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { theme } from "../chakraTheme/theme";
import { ApolloProvider } from "@apollo/client";
import { client } from "../apollographql/apollo-client";

export default function App({
  Component,
  pageProps: { session, ...pageProps }, // destructuring pageProps to get session
}: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
