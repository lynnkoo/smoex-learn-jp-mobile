import * as React from 'react'
import styles from './styles/App.module.scss'
import { DrawerModal } from '../components/DrawerModal'
import { usePopupShown } from 'shared/react-dom-basic-kit/components/Popup'
import { transformStyles } from 'shared/react-dom-basic-kit/utils'
import { LoginModal } from '../partials/LoginModal'

import { useToggleModal, asModalProps } from 'shared/react-dom-basic-kit'
import { useModalState } from 'shared/react-dom-basic-kit'
import { commonSlice } from 'shared/smoex-frontend-basic'

const cx = transformStyles(styles)

const AccountIntro = (props: any) => {
  const { showLogin } = props
  const account = commonSlice.useSelector((state: any) => state.account)
  const onAvatarClick = React.useCallback(() => {
    if (account.group === 'visitor') {
      showLogin()
    }
  }, [account.group])
  return (
    <div className={cx('account-intro')}>
      <div className={cx('intro-avatar')} onClick={onAvatarClick}>
        Avatar
      </div>
      {account.group === 'visitor' && (
        <div className={cx('intro-login')} onClick={showLogin}>
          TO LOGIN
        </div>
      )}
      {account.group === 'guest' && (
        <div className={cx('intro-complate')}>TO COMPLATED</div>
      )}
      {account.group === 'member' && (
        <div className={cx('intro-nickname')}>{account.nickname}</div>
      )}
      {!account.group && <div>SERVER ERROR</div>}
      <div onClick={showLogin}>TEST FOR LOGIN</div>
    </div>
  )
}

const MenuModal: React.FC<any> = (props) => {
  const { setOverlay } = props
  const shown = usePopupShown(props.isOpen)
  const [showLogin] = useModalState((mProps: any) => (
    <LoginModal {...asModalProps(mProps)} setOverlay={setOverlay} />
  ))
  const onShowLoginModal = () => {
    showLogin()
    setOverlay(false)
  }
  return (
    <DrawerModal {...asModalProps(props)}>
      <div className={cx('menu-modal', { shown })}>
        <AccountIntro showLogin={onShowLoginModal} />
      </div>
    </DrawerModal>
  )
}

export const Header: React.FC = () => {
  const [count, setCount] = React.useState(0)
  const [overlay, setOverlay] = React.useState(true)
  const toggleModal = useToggleModal(
    (mProps: any) => (
      <MenuModal {...asModalProps(mProps)} setOverlay={setOverlay} />
    ),
    [count],
  )

  const onToggleModal = () => {
    toggleModal()
    setCount((x) => x + 1)
  }
  return (
    <header className={cx('header')}>
      <div className={cx('header-wrapper', { overlay })}>
        <div className={cx('header-logo')}>LOGO</div>
        <div className={cx('header-menu')} onClick={onToggleModal}>
          MENU
        </div>
      </div>
    </header>
  )
}
