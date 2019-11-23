import * as React from 'react'
import { Route } from 'react-router-dom'
import { configureStore } from 'shared/redux-async-kit'
import { accountReducer } from '../shared/smoex-frontend-basic/logics/account/reducers'
import { Container } from 'shared/react-dom-basic-kit'
import { Pages } from 'shared/smoex-moblie-basic/containers/Pages'
// import { createHomeSlice } from 'common/slices/home'
import { commonSlice } from 'shared/smoex-frontend-basic'
import { Provider } from 'react-redux'
import 'shared/smoex-frontend-basic/styles/index.scss'
import { homeSlice } from 'common/slices/home'
import { createLazyComponent } from 'shared/redux-async-kit'

const store = configureStore({
  injector: commonSlice.injector,
})

window['store'] = store

const HomePage = createLazyComponent({
  injector: homeSlice.injector,
  loader: () => import('./containers/HomePage' /* webpackChunkName: "home" */),
})

const SearchPage = createLazyComponent({
  injector: homeSlice.injector,
  loader: () =>
    import('./containers/SearchPage' /* webpackChunkName: "search" */),
})

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Container>
        <Pages>
          <Route exact path="/" component={HomePage} />
          <Route path="/search" component={SearchPage} />
        </Pages>
      </Container>
    </Provider>
  )
}
