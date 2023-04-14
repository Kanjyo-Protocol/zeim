import Head from 'next/head'
import { Container, HStack, Text, Image } from '@chakra-ui/react'

type Prop = {
  children: React.ReactNode
}

export const Layout: React.FC<Prop> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Zeim</title>
        <meta name='description' content='Zeim' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Container maxW='container.xl' py={4}>
          <HStack>
            <HStack>
              <Image
                src={'/images/zeim.svg'}
                alt='Zeim'
                width={10}
                height={10}
                rounded={100}
              />
            </HStack>
            <Text fontWeight='700'>Zeim</Text>
          </HStack>
        </Container>
        {children}
      </main>
    </>
  )
}
