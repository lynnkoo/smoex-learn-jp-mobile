import { selectHomeAccount } from 'common/slices/home'

export function asAccountParams(state: any) {
  const account = selectHomeAccount(state)
  return {
    accountName: account.name,
  }
}
