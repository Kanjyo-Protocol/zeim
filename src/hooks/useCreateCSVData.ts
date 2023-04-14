import { CSVDataType, DisplayDataType } from "@/types";
import { useMemo } from "react";

export const useCreateCSVData = (data?: DisplayDataType[]) => {

  return useMemo(() => {
    if (!data) {
      return
    }

    const formattedData = data.map(d => {
      const nftTransfer = d.nftTransfer ? `transfer of TokenID: ${d.nftTransfer?.nft.tokenId} from: ${d.nftTransfer?.from} - to: ${d.nftTransfer?.to} with ${d.nftTransfer?.amount} Ether(${d.nftTransfer?.amountUSDC})` : undefined

      return {
        txnDate: d.txnDate,
        category: d.category,
        purpose: d.purpose,
        comment: d.comment,
        nftTransfer,
        payer: d.from,
        recipient: d.to,
        amount: d.amount,
        amountUSDC: d.amountUSDC,
        tokenName: d.tokenName,
        token: d.token,
        txHash: d.txHash,
      }
    })

    return formattedData.filter(x => x) as CSVDataType[]
  }, [data])
}