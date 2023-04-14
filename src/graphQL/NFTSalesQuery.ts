import { gql } from "@apollo/client"

export interface Royalty {
  beneficiaryAddress: string
  amount: string
  formattedAmount: number
  formattedAmountInNativeToken: number
  formattedAmountInUSDC: number
}

export interface Nft {
  tokenId: string
  tokenNft?: {
    metaData?: {
      image: string
      name: string
    }
  }
}

export interface NFTSaleTransaction {
  id: string
  from: {
    identity: string
  }
  to: {
    identity: string
  }
  paymentAmount: string
  dappName: string
  paymentAmountInNativeToken: string
  paymentAmountInUSDC: string
  paymentToken: {
    symbol: string
    address: string
    decimals: number
  }
  blockTimestamp: string
  nfts: Nft[],
  royalties: Royalty[] | null,
  formattedFeeAmountInUSDC: number
  formattedFeeAmountInNativeToken: number
  formattedPaymentAmountInNativeToken: number
  formattedPaymentAmountInUSDC: number
  chainId: string
  transactionHash: string
  transactionType: string
  saleType: string
}

export interface NFTSaleTransactions {
  NFTSaleTransactions: {
    NFTSaleTransaction: NFTSaleTransaction[]
  }
}
export const NFTSalesDataQuery = gql`
query NFTSalesData($tokenAddress: [Address!]) {
  NFTSaleTransactions(
    input: {blockchain: ethereum, limit: 50, filter: {nfts: {tokenAddress: {_in: $tokenAddress}}}}
  ) {
    NFTSaleTransaction {
      id
      from {
        identity
      }
      to {
        identity
      }
      dappName
      paymentAmount
      paymentAmountInNativeToken
      paymentAmountInUSDC
      paymentToken {
        symbol
        address
        decimals
      }
      blockTimestamp
      nfts {
        tokenId
        tokenNft {
          metaData {
            image
            name
          }
        }
      }
      royalties {
        beneficiaryAddress
        amount
        formattedAmount
        formattedAmountInNativeToken
        formattedAmountInUSDC
      }
      formattedFeeAmountInUSDC
      formattedFeeAmountInNativeToken
      formattedPaymentAmountInNativeToken
      formattedPaymentAmountInUSDC
      chainId
      transactionHash
      transactionType
      saleType
    }
    pageInfo {
      prevCursor
      nextCursor
    }
  }
}
`
