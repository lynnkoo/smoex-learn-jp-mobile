import * as React from 'react'
import { AppContainer, AppPage } from '../platform/components/AppContainer'
import { Route } from 'react-router-dom'
import { configureStore } from 'redux-async-kit';
import { HomeSlice, SearchSlice } from './containers/index';
import { accountReducer } from '../platform/common/logics/account/reducers';

const store = configureStore({
  reducers: {
    // common: combineReducers({
    //   account: accountReducer,
    // }),
    // TODO: 可能是 immer 造成的 reducer 只能放在最外层
    account: accountReducer,
  }
})

export const App: React.FC = () => {
  return (
    <AppContainer store={store}>
      <AppPage>
        <Route exact path="/" component={HomeSlice} />
        <Route path="/search" component={SearchSlice} />
      </AppPage>
    </AppContainer>
  )
}
