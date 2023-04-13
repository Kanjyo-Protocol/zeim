import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://api.airstack.xyz/gql",
    cache: new InMemoryCache(),
})

export default client
