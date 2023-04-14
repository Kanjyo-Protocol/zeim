import { gql } from '@apollo/client'

export interface TokenTransfer {
  amount: string
  blockNumber: number
  blockTimestamp: string
  from: {
    addresses: string
  }
  to: {
    addresses: string
  }
  formattedAmount: number
  chainId: string
  token: {
    address: string
    decimals: number
    name: string
    symbol: string
    contractMetaData: {
      image: string
    }
    chainId: string
  }
  transactionHash: string
}

export const TokenTransferQuery = gql`
  query GetTokenTransfers($walletAddress: [Identity!]) {
    TokenTransfers(
      input: {
        filter: { from: { _in: $walletAddress } }
        blockchain: ethereum
        limit: 10
        order: { blockTimestamp: DESC }
      }
    ) {
      TokenTransfer {
        amount
        blockNumber
        blockTimestamp
        from {
          addresses
        }
        to {
          addresses
        }
        formattedAmount
        chainId
        token {
          address
          decimals
          name
          symbol
          contractMetaData {
            image
          }
          chainId
        }
        transactionHash
      }
    }
  }
`
