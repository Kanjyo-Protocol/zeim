import { ApolloClient, InMemoryCache } from '@apollo/client'

const APIURL = 'https://api.lens.dev/'

export const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache()
})

export default client
