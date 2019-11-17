import * as React from 'react'
import { Provider } from 'react-redux'
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from 'react-router-dom'
import uuidv4 from 'uuid/v4'
import { useGlobalAction, useActionCallback } from 'redux-async-kit'
import { accountAsyncAction } from 'shared/smoex-frontend-basic/logics/account/actions'
import { ModalLayer } from './ModalLayer'

type IAppContainerProps = {
  basename?: string
  loading?: any
}

export const AppContext = React.createContext<any>(null)

export const Container: React.FC<IAppContainerProps> = (props) => {
  const { children, basename, loading } = props
  const [appContext, setAppContext] = React.useState()
  return (
    <AppContext.Provider value={appContext}>
      <BrowserRouter basename={basename}>
        <ModalLayer setAppContext={setAppContext} />
        {appContext ? children : loading}
      </BrowserRouter>
    </AppContext.Provider>
  )
}
