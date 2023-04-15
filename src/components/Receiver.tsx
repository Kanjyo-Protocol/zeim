import { LensProfileQuery } from '@/graphQL/LensProfileQuery'
import client from '@/utils/lensClient'
import { FC, useEffect, useState } from 'react'
import lensResponse from '@/utils/lensResponse.json'
import { ApolloQueryResult } from '@apollo/client'
import { HStack, Image, Tag, Text, Tooltip, VStack } from '@chakra-ui/react'

type Props = {
  address: string
}
export const Receiver: FC<Props> = ({ address }) => {
  const [name, setName] = useState<string>()
  const [bio, setBio] = useState<string>()
  const [imageUrl, setImageUrl] = useState<string>()
  const [ens, setEns] = useState<string>()
  const [worldCoin, setWorldCoin] = useState<boolean>(false)

  const getDefaultProfileRequest = async (address: any) => {
    let result = await client.query({
      query: LensProfileQuery,
      variables: {
        address
      }
    })

    console.log('lens api result', result)
    if (!result.data.defaultProfile) {
      console.log('load from sample json')
      result = lensResponse as ApolloQueryResult<any>
    }

    setName(result.data.defaultProfile.name)
    setBio(result.data.defaultProfile.bio)
    setImageUrl(
      result.data.defaultProfile.picture.original.url.replace(
        'ipfs://',
        'https://ipfs.io/ipfs/'
      )
    )
    setEns(result.data.defaultProfile.onChainIdentity.ens.name)
    setWorldCoin(result.data.defaultProfile.onChainIdentity.worldcoin.isHuman)
    // return result.data.defaultProfile
  }

  // make the request for the profile
  useEffect(() => {
    getDefaultProfileRequest(address)
  }, [address])

  return (
    <HStack>
      <Image src={imageUrl} alt={name} width={16} height={16} rounded={8} />
      <VStack alignItems='start'>
        <Tooltip label={address}>
          <Text>
            {address.slice(0, 5)}...
            {address.slice(-4)}
          </Text>
        </Tooltip>
        <Tooltip label={bio}>
          <Text>
            {name} ({ens ? ens : 'no ens'})
          </Text>
        </Tooltip>
        <Text>
          <Tag fontSize='xs' colorScheme='gray'>
            WORLDCOIN
          </Tag>{' '}
          {worldCoin ? (
            <Tag fontSize='xs' colorScheme='teal'>
              Human
            </Tag>
          ) : (
            <Tag fontSize='xs' colorScheme='purple'>
              not Human
            </Tag>
          )}
        </Text>
      </VStack>
    </HStack>
  )
}
