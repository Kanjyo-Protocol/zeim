export interface DisplayDataType {
  txnDate: string
  category: string
  purpose: string
  comment: string | undefined
  nftTransfer?: {
    from: string,
    to: string,
    amount: number,
    payment: string,
    nft: {
      tokenId: string,
      image: string,
      name: string
    }
  },
  from: string,
  to: string | undefined,
  amount: number | undefined,
  amountUSDC: number | undefined,
  tokenName: string,
  token: string,
  txHash: string,
}

export interface CSVDataType {
  txnDate: string,
  category: string,
  purpose: string,
  comment: string | undefined,
  nftTransfer?: string,
  from: string,
  payer: string,
  recipient: string
  amount: number
  amountUSDC: number
  tokenName: string
  token: string
  txHash: string
}
