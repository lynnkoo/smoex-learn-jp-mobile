import * as React from 'react'
import { FullScreenModal } from '../components/FullScreenModal'
import styles from './styles/LoginModal.module.scss'
import { asModalProps } from 'shared/react-dom-basic-kit'
import { useFormState } from 'shared/react-dom-basic-kit/components/Form'
import { transformStyles } from 'shared/react-dom-basic-kit/utils'
import { enhanceFormComponent } from 'shared/react-dom-basic-kit/components/Form'
import { useActionCallback } from 'shared/redux-async-kit'
import { accountAsyncAction } from 'shared/smoex-frontend-basic/logics/account/actions'
import { LoginFormInput } from '././LoginModal'
import { commonSlice } from 'shared/smoex-frontend-basic'

const cx = transformStyles(styles)

const TLoginForm: React.FC<any> = (props) => {
  const { translateForm, onCloseModal } = props
  const [data, setData] = useFormState()
  const [loginType, setLoginType] = React.useState('password')
  // const [loading, setLoading] = React.useState(false);

  const [login, LoginLoading] = commonSlice.useAction(accountAsyncAction.login)
  const [update, updateLoading] = commonSlice.useAction(
    accountAsyncAction.getInfo,
  )
  const loading = LoginLoading || updateLoading

  const [onLogin, error] = useActionCallback(async () => {
    const { account, password } = data
    await login(account, password)
    onCloseModal()
  }, [login, data])

  React.useEffect(() => {
    setData({ password: '', verifyCode: '' })
  }, [loginType])

  const onChangeType = () => {
    setLoginType((x) => (x === 'password' ? 'code' : 'password'))
  }

  return (
    <form className={cx('login-form')}>
      <div className={cx('login-label')}>
        PHONE{loginType === 'password' && '/USERNAME'}
      </div>
      <LoginFormInput name="account" />
      <div className={cx('login-label')}>
        {loginType === 'password' ? 'PASSWORD' : 'VERIFY CODE'}
      </div>
      {loginType === 'password' && (
        <LoginFormInput name="password">
          <div className={cx('login-send-code')}>FORGET PASSWORD</div>
        </LoginFormInput>
      )}
      {loginType === 'code' && (
        <LoginFormInput name="verifyCode">
          <div className={cx('login-send-code')}>SEND CODE</div>
        </LoginFormInput>
      )}
      <div className={cx('login-change-type')} onClick={onChangeType}>
        LOGIN BY {loginType !== 'password' ? 'PASSWORD' : 'VERIFY CODE'}
      </div>
      <div className={cx('login-form-btn')} onClick={onLogin}>
        LOGIN{loading && '...'}
      </div>
      <div
        className={cx('login-form-btn')}
        onClick={() => translateForm('register')}
      >
        REGISTER
      </div>
    </form>
  )
}

export const LoginForm = enhanceFormComponent(TLoginForm)
