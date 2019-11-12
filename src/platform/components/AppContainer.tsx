import * as React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route, Redirect, useLocation, useHistory } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import uuidv4 from 'uuid/v4';
import { useGlobalAction, useActionCallback } from 'redux-async-kit';
import { accountAsyncAction } from 'platform/common/logics/account/actions';
import { ModalLayer } from './ModalLayer';

type IAppContainerProps = {
  store: any
  basename?: string
}

export const AppContext = React.createContext<any>(null)

export function useModalState(modal: any, deps: any = []) {
  const { showModal, closeModal } = React.useContext(AppContext)
  const [modalId, setModalId] = React.useState()
  const onShowModal = React.useCallback(() => {
    const modalId = showModal(modal)
    setModalId(modalId)
  }, deps)
  const onCloseModal = React.useCallback(() => {
    closeModal(modalId)
  }, [modalId])
  return [onShowModal, onCloseModal]
}

export const AppPage: React.FC<any> = props => {
  const { children } = props
  const [getInfo, loading] = useGlobalAction(accountAsyncAction.getInfo)
  const [onGetInfo, error] = useActionCallback(getInfo)
  React.useEffect(() => {
    onGetInfo()
  }, [])
  return !loading && (
    <>
      <AppHeader />
      <Switch>
        {error ? <h1>500</h1> : children}
      </Switch>
      {/* <Footer /> */}
    </>
  )
}

// const Footer = () => {
//   return (
//     <div>footer</div>
//   )
// }

export const AppContainer: React.FC<IAppContainerProps> = props => {
  const { store, children, basename } = props
  const [appContext, setAppContext] = React.useState()

  const loading = !appContext
  return (
    <Provider store={store}>
      <AppContext.Provider value={appContext}>
        <BrowserRouter basename={basename}>
          <ModalLayer setAppContext={setAppContext} />
          {!!appContext && children}
        </BrowserRouter>
      </AppContext.Provider>
    </Provider>
  )
}
