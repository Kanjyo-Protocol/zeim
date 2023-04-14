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
  Input,
  Editable,
  EditablePreview,
  EditableInput,
  EditableTextarea
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { useNFTSalesData } from '@/hooks/useNFTSalesData'
import { useTokenData } from '@/hooks/useTokenData'
import { headers } from '@/utils/csvHeader'
import { ArrowForwardIcon, DownloadIcon } from '@chakra-ui/icons'
import { Layout } from '@/components/Layout'
import { DisplayDataType } from '@/types'
import { useCreateCSVData } from '@/hooks/useCreateCSVData'
import { Receiver } from '@/components/Receiver'

export default function Home() {
  const [addresses, setAddresses] = useState<string[]>()
  const [address, setAddress] = useState<string>()
  const targetAddress = useMemo(() => addresses, [addresses])
  const nftData = useNFTSalesData(targetAddress)
  const tokenData = useTokenData(targetAddress)

  const mergedData = useMemo(
    () =>
      tokenData.data ? tokenData.data.concat(nftData.data || []) : nftData.data,
    [nftData.data, tokenData.data]
  )

  const [editableData, setEditableData] = useState<DisplayDataType[]>()

  useEffect(() => {
    if (mergedData) {
      setEditableData(
        mergedData.sort(
          (a, b) =>
            new Date(b.txnDate).getTime() - new Date(a.txnDate).getTime()
        )
      )
    }
  }, [mergedData])

  const csvData = useCreateCSVData(editableData)

  console.log('value', editableData)

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

  console.log('csData', csvData)

  const handleOnSubmitEditable = (i: number, val: any) => {
    setEditableData((prev) => {
      if (!prev) {
        return
      }
      return prev.map((d, j) => {
        if (j != i) {
          return d
        }
        return { ...d, ...val }
      })
    })
  }

  return (
    <Layout>
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
                <Th textAlign={'center'}>Comment</Th>
              </Tr>
            </Thead>
            <Tbody>
              {editableData &&
                editableData.map((nft, i) => {
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
                      <Td>
                        <Editable
                          defaultValue={nft.purpose}
                          onSubmit={(value) =>
                            handleOnSubmitEditable(i, { purpose: value })
                          }
                        >
                          <EditablePreview />
                          <EditableInput />
                        </Editable>
                      </Td>
                      <Td>
                        <VStack alignItems='start'>
                          <Text fontWeight='700'>{nft.amount} ETH</Text>
                          <Text color='gray.400'>{nft.amountUSDC} USDC</Text>
                        </VStack>
                      </Td>
                      <Td>
                        {nft.nftTransfer && nft.nftTransfer ? (
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
                        ) : (
                          <Receiver address={nft.from || ''} />
                        )}
                      </Td>
                      <Td>
                        <Receiver address={nft.to || ''} />
                      </Td>
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
                      <Td>
                        <Editable
                          defaultValue={nft.comment || '--'}
                          onSubmit={(value) =>
                            handleOnSubmitEditable(i, { comment: value })
                          }
                          textAlign={'center'}
                        >
                          <EditablePreview width={300} />
                          <EditableTextarea width={300} />
                        </Editable>
                      </Td>
                    </Tr>
                  )
                })}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  )
}
