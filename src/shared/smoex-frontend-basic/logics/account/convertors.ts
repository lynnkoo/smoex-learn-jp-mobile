import { homeSlice } from 'common/slices/home'

export function asAccountParams(state: any) {
  const account = homeSlice.selector(state)
  return {
    accountName: account.name,
  }
}
