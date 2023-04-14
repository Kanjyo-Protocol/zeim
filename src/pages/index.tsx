import Head from 'next/head'
import { Inter } from 'next/font/google'
import {
  Button,
  Container,
  Flex,
  FormControl,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Image,
  Spacer,
  VStack,
  Tag,
  HStack,
  TagLabel,
  TagCloseButton,
  WrapItem,
  Wrap,
  Table,
  Input
} from '@chakra-ui/react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { CSVLink } from 'react-csv'
import { useNFTSalesData } from '@/hooks/useNFTSalesData'
import { headers } from '@/utils/csvHeader'
import { ArrowForwardIcon, DownloadIcon } from '@chakra-ui/icons'

export default function Home() {
  const addressRef = useRef<HTMLInputElement>(null)
  const [addresses, setAddresses] = useState<string[]>()
  const [address, setAddress] = useState<string>()
  const targetAddress = useMemo(() => addresses, [addresses])
  const nftData = useNFTSalesData(targetAddress)

  console.log('value', address)
  const handleAddAddress = useCallback(() => {
    if (!address || address == '') {
      return
    }

    setAddresses((prev) => {
      if (prev) {
        return [...prev, address]
      }
      return [address]
    })
    setAddress('')
  }, [address])

  const handleRemoveAddress = (index: number) => {
    setAddresses(addresses?.filter((_, i) => i != index))
  }

  const csvData = nftData.csvData
  console.log('nftData', nftData)

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

        <Container maxW='container.lg' mt={50}>
          <HStack w='full'>
            <FormControl>
              <Input
                type='text'
                placeholder='Enter wallet address'
                value={address}
                onChange={({ target }) => setAddress(target.value)}
              />
            </FormControl>
            <Button onClick={handleAddAddress}>Add</Button>
          </HStack>

          <Wrap mt={4}>
            {addresses?.map((address, index) => (
              <WrapItem key={address}>
                <Tag fontSize={'sm'} colorScheme={'gray'}>
                  <TagLabel>
                    {address.slice(0, 5)}...{address.slice(-4)}
                  </TagLabel>
                  <TagCloseButton onClick={() => handleRemoveAddress(index)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </Container>
        <Container maxW={'90%'} mt={20}>
          {csvData && (
            <Flex w='full' justify='end' mb={4}>
              <Button
                as={CSVLink}
                data={csvData}
                headers={headers}
                filename={`transaction-${new Date()}.csv`}
                leftIcon={<DownloadIcon />}
              >
                Export CSV
              </Button>
            </Flex>
          )}
          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Category</Th>
                  <Th>Purpose</Th>
                  <Th>Amount</Th>
                  <Th>From</Th>
                  <Th>To</Th>
                  <Th>NFT Transfer</Th>
                  <Th>Comment</Th>
                </Tr>
              </Thead>
              <Tbody>
                {nftData?.data &&
                  nftData.data.map((nft, i) => {
                    const date = new Date(nft.txnDate)
                    return (
                      <Tr key={i}>
                        <Td>{date.toLocaleDateString('en-US')}</Td>
                        <Td>
                          <Tag
                            colorScheme={
                              nft.category == 'Income' ? 'teal' : 'purple'
                            }
                          >
                            {nft.category}
                          </Tag>
                        </Td>
                        <Td>{nft.purpose}</Td>
                        <Td>
                          <VStack alignItems='start'>
                            <Text fontWeight='700'>{nft.amount} ETH</Text>
                            <Text color='gray.400'>{nft.amountUSDC} USDC</Text>
                          </VStack>
                        </Td>
                        <Td>
                          <HStack pr={4}>
                            <Image
                              src={
                                nft.from == 'opensea'
                                  ? '/images/opensea.svg'
                                  : nft.from == 'blur'
                                  ? '/images/blur.jpg'
                                  : undefined
                              }
                              alt={nft.from}
                              width={10}
                              height={10}
                              rounded={100}
                            />
                            <Text>{nft.from}</Text>
                          </HStack>
                        </Td>
                        <Td>{nft.to}</Td>
                        <Td>
                          {nft.nftTransfer && nft.nftTransfer && (
                            <>
                              <HStack>
                                <Image
                                  src={nft.nftTransfer.nft.image?.replace(
                                    'ipfs://',
                                    'https://ipfs.io/ipfs/'
                                  )}
                                  alt={nft.nftTransfer.nft.name}
                                  width={16}
                                  height={16}
                                  rounded={8}
                                />
                                <VStack alignItems='start'>
                                  <HStack>
                                    <Text fontSize='sm' color='gray.400'>
                                      Token ID
                                    </Text>
                                    <Text>{nft.nftTransfer.nft.tokenId}</Text>
                                  </HStack>
                                  <Spacer />
                                  <HStack>
                                    <Tag fontSize='xs' colorScheme='gray'>
                                      {nft.nftTransfer.from.slice(0, 5)}...
                                      {nft.nftTransfer.from.slice(-4)}
                                    </Tag>
                                    <ArrowForwardIcon color='gray.400' />
                                    <Tag fontSize='xs' colorScheme='gray'>
                                      {nft.nftTransfer.to.slice(0, 5)}...
                                      {nft.nftTransfer.to.slice(-4)}
                                    </Tag>
                                  </HStack>
                                </VStack>
                              </HStack>
                            </>
                          )}
                        </Td>
                        <Td>{nft.comment}</Td>
                      </Tr>
                    )
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Container>
      </main>
    </>
  )
}
