import loadableTemp from 'react-loadable'
import { combineReducers } from 'redux'
import { injectReducers } from './store'

const loadable: any = loadableTemp
const NoLoading: React.FC = () => {
  return null
}
export function createContainer(opts: any) {
  const { reducers = {}, loader, name, loading} = opts
  const route = loadable({
    loader: () => {
      if (reducers) {
        injectReducers(reducers, name)
      }
      return loader()
    },
    loading: loading || NoLoading
  })
  return route
}
