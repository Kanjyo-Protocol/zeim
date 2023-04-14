import { NFTSaleTransactions, NFTSalesDataQuery } from "@/graphQL/NFTSalesQuery"
import { CSVDataType, DisplayDataType } from "@/types"
import { useQuery } from "@apollo/client"
import { useMemo } from "react"

export const useNFTSalesData = (addresses?: string[]) => {
  const { loading, data, error } = useQuery(NFTSalesDataQuery, {
    variables: { tokenAddress: addresses }
  })

  console.error(error)
  const formatedRoylaityData = useMemo(() => {
    if (!data) {
      return
    }

    const typeData = data as NFTSaleTransactions
    const royalties = typeData.NFTSaleTransactions.NFTSaleTransaction.map(txn => {
      if (!txn.royalties) {
        return
      }

      console.log('wow', txn.transactionHash, txn.royalties)
      return {
        txnDate: txn.blockTimestamp,
        category: 'income',
        purpose: 'royalties',
        comment: undefined,
        nftTransfer: {
          from: txn.from.identity,
          to: txn.to.identity,
          amount: txn.formattedPaymentAmountInNativeToken,
          payment: txn.paymentToken.symbol,
          nft: {
            tokenId: txn.nfts[0].tokenId,
            image: txn.nfts[0].tokenNft?.metaData?.image,
            name: txn.nfts[0].tokenNft?.metaData?.name
          }
        },
        from: txn.dappName,
        to: txn.royalties[0]?.beneficiaryAddress,
        amount: txn.royalties[0]?.formattedAmountInNativeToken,
        amountUSDC: txn.royalties[0]?.formattedAmountInUSDC,
        tokenName: txn.paymentToken.symbol,
        token: txn.paymentToken.address,
        txHash: txn.transactionHash,
      }
    }).filter(x => x) as DisplayDataType[]

    const csvData = typeData.NFTSaleTransactions.NFTSaleTransaction.map(txn => {
      if (!txn.royalties) {
        return
      }

      return {
        txnDate: txn.blockTimestamp,
        category: 'income',
        purpose: 'royalties',
        comment: undefined,
        nftTransfer: `transfer of TokenID: ${txn.nfts[0].tokenId} from: ${txn.from.identity} - to: ${txn.to.identity} with ${txn.paymentAmountInNativeToken} Ether(${txn.paymentAmountInUSDC})`,
        payer: txn.dappName,
        recipient: txn.royalties[0]?.beneficiaryAddress,
        amount: txn.royalties[0]?.formattedAmountInNativeToken,
        amountUSDC: txn.royalties[0]?.formattedAmountInUSDC,
        tokenName: txn.paymentToken.symbol,
        token: txn.paymentToken.address,
        txHash: txn.transactionHash,
      }
    }).filter(x => x) as CSVDataType[]

    return {
      csvData,
      data: royalties
    }
  }, [data])

  console.log('nft', formatedRoylaityData)
  return {
    loading,
    error,
    csvData: formatedRoylaityData?.csvData,
    data: formatedRoylaityData?.data
  }
}