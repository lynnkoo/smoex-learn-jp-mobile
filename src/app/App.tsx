import * as React from 'react'
import { AppContainer, AppPage } from '../platform/components/AppContainer'
import { Route } from 'react-router-dom'
import { configureStore } from '../shared/redux-kit/store';
import { createContainer } from '../shared/redux-kit/dynamic';
import { commonReducer } from '../platform/common/logics';
import { HomeSlice, SearchSlice } from './containers/index';
import { combineReducers } from 'redux';
import { accountReducer } from '../platform/common/logics/account/reducers';
import { useGlobalAction } from 'shared/redux-kit';
import { accountAsyncAction } from 'platform/common/logics/account/actions';

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
