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
  EditableTextarea,
  Tooltip
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
          <Table variant='simple' size='sm'>
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
                editableData.map((record, i) => {
                  const date = new Date(record.txnDate)
                  return (
                    <Tr key={i}>
                      <Td>{date.toLocaleDateString('en-US')}</Td>
                      <Td>
                        <Tag
                          colorScheme={
                            record.category == 'Income' ? 'teal' : 'purple'
                          }
                        >
                          {record.category}
                        </Tag>
                      </Td>
                      <Td>
                        <Editable
                          value={record.purpose}
                          onSubmit={(value) =>
                            handleOnSubmitEditable(i, { purpose: value })
                          }
                        >
                          <EditablePreview />
                          <EditableInput />
                        </Editable>
                      </Td>
                      <Td isNumeric>
                        {record.nftTransfer && record.nftTransfer ? (
                          <VStack alignItems='end'>
                            <Tooltip label={record.amount + 'ETH'}>
                              <Text fontWeight='700'>
                                {record.amount &&
                                  (record.amount.toString().length < 6
                                    ? record.amount
                                    : record.amount.toFixed(6) + '...')}{' '}
                                ETH
                              </Text>
                            </Tooltip>
                            <Tooltip label={record.amountUSDC + 'USDC'}>
                              <Text color='gray.400'>
                                {record.amountUSDC &&
                                  (record.amountUSDC.toString().length < 6
                                    ? record.amountUSDC
                                    : record.amountUSDC.toFixed(6) +
                                      '...')}{' '}
                                USDC
                              </Text>
                            </Tooltip>
                          </VStack>
                        ) : (
                          <Tooltip
                            label={record.amount + ' ' + record.tokenName}
                          >
                            <Text fontWeight='700'>
                              {record.amount &&
                                (record.amount.toString().length < 6
                                  ? record.amount
                                  : record.amount.toFixed(6) + '...')}{' '}
                              {record.tokenName}
                            </Text>
                          </Tooltip>
                        )}
                      </Td>
                      <Td>
                        {record.nftTransfer && record.nftTransfer ? (
                          <HStack pr={4}>
                            <Image
                              src={
                                record.from == 'opensea'
                                  ? '/images/opensea.svg'
                                  : record.from == 'blur'
                                  ? '/images/blur.jpg'
                                  : undefined
                              }
                              alt={record.from}
                              width={10}
                              height={10}
                              rounded={100}
                            />
                            <Text>{record.from}</Text>
                          </HStack>
                        ) : (
                          <Receiver address={record.from || ''} />
                        )}
                      </Td>
                      <Td>
                        <Receiver address={record.to || ''} />
                      </Td>
                      <Td>
                        {record.nftTransfer && record.nftTransfer && (
                          <>
                            <HStack>
                              <Image
                                src={record.nftTransfer.nft.image?.replace(
                                  'ipfs://',
                                  'https://ipfs.io/ipfs/'
                                )}
                                alt={record.nftTransfer.nft.name}
                                width={16}
                                height={16}
                                rounded={8}
                              />
                              <VStack alignItems='start'>
                                <HStack>
                                  <Text fontSize='sm' color='gray.400'>
                                    Token ID
                                  </Text>
                                  <Text>{record.nftTransfer.nft.tokenId}</Text>
                                </HStack>
                                <Spacer />
                                <HStack>
                                  <Tag fontSize='xs' colorScheme='gray'>
                                    {record.nftTransfer.from.slice(0, 5)}...
                                    {record.nftTransfer.from.slice(-4)}
                                  </Tag>
                                  <ArrowForwardIcon color='gray.400' />
                                  <Tag fontSize='xs' colorScheme='gray'>
                                    {record.nftTransfer.to.slice(0, 5)}...
                                    {record.nftTransfer.to.slice(-4)}
                                  </Tag>
                                </HStack>
                              </VStack>
                            </HStack>
                          </>
                        )}
                      </Td>
                      <Td>
                        <Editable
                          defaultValue={record.comment || '--'}
                          onSubmit={(value) =>
                            handleOnSubmitEditable(i, { comment: value })
                          }
                          textAlign={'center'}
                        >
                          <EditablePreview />
                          <EditableTextarea />
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
