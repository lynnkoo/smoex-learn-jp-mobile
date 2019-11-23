import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Header } from './Header'
import { useActionCallback } from 'shared/redux-async-kit'
import { accountAsyncAction } from 'shared/smoex-frontend-basic/logics/account'
import { Footer } from './Footer'
import { PageError } from './PageError'
import { PageLoading } from './PageLoading'
import { commonSlice } from 'shared/smoex-frontend-basic'

const PageContext = React.createContext<any>(null)

const DEFALUT_HEADER_PROPS = {
  visible: true,
}
const DEFALUT_FOOTER_PROPS = {
  visible: true,
}
export const Pages: React.FC<any> = (props) => {
  const { children } = props
  const [getInfo, loading] = commonSlice.useAction(accountAsyncAction.getInfo)
  const [onGetInfo, error] = useActionCallback(getInfo)
  const [headerProps, setHeaderProps] = React.useState(DEFALUT_HEADER_PROPS)
  const [footerProps, setFooterProps] = React.useState(DEFALUT_HEADER_PROPS)

  const [pageContext] = React.useState({
    setHeaderProps: (headerProps: any) =>
      setHeaderProps((props) => ({ ...props, ...headerProps })),
    setFooterProps: (footerProps: any) =>
      setFooterProps((props) => ({ ...props, ...footerProps })),
  })

  React.useEffect(() => {
    onGetInfo()
  }, [])
  return (
    <PageContext.Provider value={pageContext}>
      {headerProps.visible && <Header />}
      {loading ? (
        <PageLoading />
      ) : (
        <Switch>
          {false ? <PageError code={500} /> : children}
          <Route render={() => <PageError code={404} />} />
        </Switch>
      )}
      {footerProps.visible && <Footer />}
    </PageContext.Provider>
  )
}

export function useHeaderProps(heardProps: any) {
  const { setHeaderProps } = React.useContext(PageContext)
  React.useEffect(() => {
    setHeaderProps(heardProps)
    return () => {
      setHeaderProps(DEFALUT_HEADER_PROPS)
    }
  }, [])
}

export function useFooterProps(heardProps: any) {
  const { setFooterProps } = React.useContext(PageContext)
  React.useEffect(() => {
    setFooterProps(heardProps)
    return () => {
      setFooterProps(DEFALUT_FOOTER_PROPS)
    }
  }, [])
}
