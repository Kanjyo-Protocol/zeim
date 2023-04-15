import {
  TokenTransfers,
  TokenTransferQuery
} from '@/graphQL/TokensTransferQuery'
import { CSVDataType, DisplayDataType } from '@/types'
import { useQuery } from '@apollo/client'
import { useMemo } from 'react'

export const useTokenData = (addresses?: string[]) => {
  const { loading, data, error } = useQuery(TokenTransferQuery, {
    variables: { targetAddress: addresses }
  })

  console.error(error)
  const formattedData = useMemo(() => {
    if (!data) {
      return
    }

    const typeData = data as TokenTransfers
    const royalties =
      typeData.TokenTransfers.TokenTransfer &&
      (typeData.TokenTransfers.TokenTransfer.map((txn) => {
        if (!txn.formattedAmount) {
          return
        }

        console.log('wow', txn.transactionHash, txn.formattedAmount)
        return {
          txnDate: txn.blockTimestamp,
          category: 'expense',
          purpose: 'Payment',
          comment: undefined,
          nftTransfer: undefined,
          from: txn.from.addresses[0],
          to: txn.to.addresses[0],
          amount: txn.formattedAmount,
          amountUSDC: undefined,
          tokenName: txn.token.symbol,
          token: txn.token.address,
          txHash: txn.transactionHash
        }
      }).filter((x) => x) as DisplayDataType[])

    const csvData =
      typeData.TokenTransfers.TokenTransfer &&
      (typeData.TokenTransfers.TokenTransfer.map((txn) => {
        if (!txn.formattedAmount) {
          return
        }

        return {
          txnDate: txn.blockTimestamp,
          category: 'token transfer',
          purpose: 'payment',
          comment: undefined,
          nftTransfer: undefined,
          payer: txn.from.addresses[0],
          recipient: txn.to.addresses[0],
          amount: txn.formattedAmount,
          amountUSDC: undefined,
          tokenName: txn.token.symbol,
          token: txn.token.address,
          txHash: txn.transactionHash
        }
      }).filter((x) => x) as CSVDataType[])

    return {
      csvData,
      data: royalties
    }
  }, [data])

  console.log('token', formattedData)
  const memoData = useMemo(() => {
    return {
      csvData: formattedData?.csvData,
      data: formattedData?.data
    }
  }, [formattedData])

  return {
    loading,
    error,
    csvData: memoData?.csvData,
    data: memoData?.data
  }
}
