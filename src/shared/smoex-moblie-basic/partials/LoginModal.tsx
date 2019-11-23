import * as React from 'react'
import { FullScreenModal } from '../components/FullScreenModal'
import styles from './styles/LoginModal.module.scss'
import { asModalProps } from 'shared/react-dom-basic-kit'
import { useFormState } from 'shared/react-dom-basic-kit/components/Form'
import { transformStyles } from 'shared/react-dom-basic-kit/utils'
import { enhanceFormComponent } from 'shared/react-dom-basic-kit/components/Form'
import {} from 'shared/redux-async-kit'
import { accountAsyncAction } from 'shared/smoex-frontend-basic/logics/account/actions'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

const cx = transformStyles(styles)

export const LoginFormInput: React.FC<any> = (props) => {
  const { name, children } = props
  const [data, setData] = useFormState()
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setData({ [name]: value })
    },
    [name],
  )
  return (
    <div className={cx('login-input-wrapper')}>
      <input
        className={cx('login-input')}
        value={data[name] || ''}
        onChange={onChange}
      />
      {children}
    </div>
  )
}

export const LoginModal: React.FC<any> = (props) => {
  const { setOverlay } = props
  const [form, translateForm] = React.useState('login')
  const onCloseModal = () => {
    setOverlay(true)
    props.onClose()
  }
  return (
    <FullScreenModal {...asModalProps(props)} onClose={onCloseModal}>
      <div className={cx('login-modal')}>
        <div className={cx('login-modal-logo')}>SMOEX</div>
        {form === 'login' && (
          <LoginForm
            translateForm={translateForm}
            onCloseModal={onCloseModal}
          />
        )}
        {form === 'register' && <RegisterForm translateForm={translateForm} />}
      </div>
    </FullScreenModal>
  )
}
