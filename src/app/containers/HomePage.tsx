import * as React from 'react'
import styles from './styles/HomePage.module.scss'
import { transformStyles } from '../../platform/utils/styles';
import { Link } from 'react-router-dom';
import { useAction } from '../../shared/redux-kit';
import { accountAsyncAction } from '../../platform/common/logics/account/actions';
import { useHomeSelector, useHomeAction, selectHomeAccount } from '../../common/slices/home';
import { ModalBeta } from 'platform/components/hooks/modal';
import { FullScreenModal, MessageModal } from 'platform/components/FullScreenModal';
import { AppContext } from 'platform/components/AppContainer';
const cx = transformStyles(styles)

// name = Home
type IHomePageProps = {
  className?: string
}

export const HomePage: React.FC = (props: any) => {
  const { className } = props
  const [updateInfo, loading, error] = useHomeAction(accountAsyncAction.getInfo)
  const account = useHomeSelector((home: any) => home.account)
  const [count, setCount] = React.useState(0)
  const onUpdateInfo = React.useCallback(() => {
    updateInfo(count)
  }, [count])
  const [visible, setVisible] = React.useState(true)
  const { showModal, closeModal } = React.useContext(AppContext);
  const onToggleModal = () => {
    showModal(FullScreenModal, {
      children: (
        <div>
          <div onClick={closeModal}>CLOSE CLOSE</div>
          <div onClick={() => showModal(MessageModal, {})}>SHOWMODAL</div>
        </div>
      )
    })
  }
  return (
    <div className={cx('home-page')}>
      <div>{account.name} </div>
      <div onClick={onUpdateInfo}>UPDATE NAME</div>
      <div>{count}</div>
      <div onClick={() => setCount(x => x + 1)}>ADD COUNT</div>
      <div>{loading && 'loading'}</div>
      <div>{account.loading && 'account loading'}</div>
      <div>{error && 'error: ' + JSON.stringify(error)}</div>
      <Link to="/search">TO SEARCH</Link>
    </div>
  )
}

export default HomePage
