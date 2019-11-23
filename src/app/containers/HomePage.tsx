import * as React from 'react'
import styles from './styles/HomePage.module.scss'
import { AppContext } from 'shared/react-dom-basic-kit'
import { transformStyles } from 'shared/react-dom-basic-kit/utils'
import { Link } from 'react-router-dom'
import { accountAsyncAction } from '../../shared/smoex-frontend-basic/logics/account/actions'
import { homeSlice } from 'common/slices/home'
import {
  FullScreenModal,
  MessageModal,
} from 'shared/smoex-moblie-basic/components/FullScreenModal'
import { useHeaderProps } from 'shared/smoex-moblie-basic/containers/Pages'
const cx = transformStyles(styles)

// name = Home
type IHomePageProps = {
  className?: string
}

export const HomePage: React.FC = (props: any) => {
  const { className } = props
  const [updateInfo, loading, error] = homeSlice.useAction(
    accountAsyncAction.getInfo,
  )
  const account = homeSlice.useSelector((home: any) => home.account)
  const [count, setCount] = React.useState(0)
  const onUpdateInfo = React.useCallback(() => {
    updateInfo(count)
  }, [count])
  const [visible, setVisible] = React.useState(true)
  const { showModal, closeModal } = React.useContext(AppContext)
  const onToggleModal = () => {
    showModal(FullScreenModal, {
      children: (
        <div>
          <div onClick={closeModal}>CLOSE CLOSE</div>
          <div onClick={() => showModal(MessageModal, {})}>SHOWMODAL</div>
        </div>
      ),
    })
  }
  return (
    <section className={cx('home-page')}>
      <div>{account.name} </div>
      <div onClick={onUpdateInfo}>UPDATE NAME</div>
      <div>{count}</div>
      <div onClick={() => setCount((x) => x + 1)}>ADD COUNT</div>
      <div>{loading && 'loading'}</div>
      <div>{account.loading && 'account loading'}</div>
      <div>{error && 'error: ' + JSON.stringify(error)}</div>
      <Link to="/search">TO SEARCH</Link>
      <br />
      <Link to="/notfound">TO NOTFOUND</Link>
    </section>
  )
}

export default HomePage
