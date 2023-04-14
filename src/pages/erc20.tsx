import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tag,
  TagCloseButton,
  TagLabel,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  TokenTransfer,
  TokenTransferQuery
} from '@/graphQL/TokensTransferQuery'
import { useQuery } from '@apollo/client'
import { CSVLink } from 'react-csv'
import { Receiver } from '@/components/Receiver'
import { Layout } from '@/components/Layout'

export default function Home() {
  const [addresses, setAddresses] = useState<string[]>()
  const [address, setAddress] = useState<string>()
  const targetAddress = useMemo(() => addresses, [addresses])

  const { loading, error, data, refetch } = useQuery(TokenTransferQuery, {
    variables: { targetAddress }
  })

  console.log(loading, error, data, address)

  const d = data as { TokenTransfers: { TokenTransfer: TokenTransfer[] } }
  const csvData = useMemo(() => {
    if (!d) {
      return
    }
    return d.TokenTransfers.TokenTransfer.map((transfer: TokenTransfer, i) => {
      return {
        txnData: transfer.blockTimestamp,
        payer: '',
        recipient: '',
        category: 'income',
        purpose: '',
        comment: '',
        fromAddress: transfer.from.addresses,
        toAddress: transfer.to.addresses,
        amount: transfer.formattedAmount,
        tokenName: transfer.token.name,
        token: transfer.token.address,
        txHash: transfer.transactionHash
      }
    })
  }, [d])

  const headers = [
    { label: 'Date', key: 'txnDate' },
    { label: 'Payer', key: 'payer' },
    { label: 'Recipient', key: 'recipient' },
    { label: 'Category', key: 'category' },
    { label: 'Purpose', key: 'purpose' },
    { label: 'Comment', key: 'comment' },
    { label: 'Token', key: 'token' },
    { label: 'Token Name', key: 'tokenName' },
    { label: 'Transaction Hash', key: 'txHash' },
    { label: 'Payer Address', key: 'fromAddress' },
    { label: 'Recipient Address', key: 'toAddress' }
  ]

  useEffect(() => {}, [])

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

  console.log('tokenData', csvData)

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
                <Th></Th>
                <Th>Comment</Th>
              </Tr>
            </Thead>
            <Tbody>
              {d &&
                d.TokenTransfers.TokenTransfer.map((transfer, i) => {
                  const date = new Date(transfer.blockTimestamp)
                  console.log('image', transfer.token.contractMetaData.image)
                  return (
                    <Tr key={i}>
                      <Td>{date.toLocaleDateString('en-US')}</Td>
                      <Td>
                        <Tag colorScheme='teal'>token transfer</Tag>
                      </Td>
                      <Td></Td>
                      <Td>
                        <Text fontWeight='700'>
                          {transfer.formattedAmount}{' '}
                          {transfer.token.contractMetaData.image && (
                            <Image
                              src={transfer.token.contractMetaData.image}
                              alt=''
                            />
                          )}
                          {transfer.token.symbol}
                        </Text>
                      </Td>
                      <Td>
                        <Receiver address={transfer.from.addresses[0] || ''} />
                      </Td>
                      <Td>
                        <Receiver address={transfer.to.addresses[0] || ''} />
                      </Td>
                      <Td></Td>
                      <Td></Td>
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
