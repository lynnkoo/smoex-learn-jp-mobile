import * as React from 'react'
import { Route } from 'react-router-dom'
import { configureStore } from 'redux-async-kit'
import { accountReducer } from '../shared/smoex-frontend-basic/logics/account/reducers'
import { Container } from 'shared/react-dom-basic-kit'
import { Pages } from 'shared/smoex-moblie-basic/containers/Pages'
import { createHomeSlice } from 'common/slices/home'
import { Provider } from 'react-redux'
import 'shared/smoex-frontend-basic/styles/index.scss'

const store = configureStore({
  reducers: {
    // TODO: 可能是 immer 造成的 reducer 只能放在最外层
    account: accountReducer,
  },
})

export const HomeSlice = createHomeSlice({
  loader: () => import('./containers/HomePage' /* webpackChunkName: "home" */),
})

export const SearchSlice = createHomeSlice({
  loader: () =>
    import('./containers/SearchPage' /* webpackChunkName: "search" */),
})

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Container>
        <Pages>
          <Route exact path="/" component={HomeSlice} />
          <Route path="/search" component={SearchSlice} />
        </Pages>
      </Container>
    </Provider>
  )
}
