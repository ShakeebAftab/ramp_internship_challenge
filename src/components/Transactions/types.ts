import { FunctionComponent } from "react"
import { Transaction } from "../../utils/types"
import { RegisteredEndpoints } from "../../utils/fetch"

export type SetTransactionApprovalFunction = (params: {
  transactionId: string
  newValue: boolean
}) => Promise<void>

type TransactionsProps = {
  transactions: Transaction[] | null

  clearCacheByEndpoint: (endpointsToClear: RegisteredEndpoints[]) => void
}

type TransactionPaneProps = {
  transaction: Transaction
  loading: boolean
  approved?: boolean
  setTransactionApproval: SetTransactionApprovalFunction
  clearCacheByEndpoint: (endpointsToClear: RegisteredEndpoints[]) => void
}

export type TransactionsComponent = FunctionComponent<TransactionsProps>
export type TransactionPaneComponent = FunctionComponent<TransactionPaneProps>
