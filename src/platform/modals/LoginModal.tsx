import * as React from 'react'
import { FullScreenModal } from '../components/FullScreenModal'
import styles from './styles/LoginModal.module.scss'
import { transformStyles } from '../utils/styles';
import { enhanceFormComponent } from 'platform/components/Form';
import { useFormState } from '../components/Form';
import { useGlobalSelector, useActionCallback, useGlobalAction, useAsyncCallback } from 'redux-async-kit';
import { accountAsyncAction } from 'platform/common/logics/account/actions';
import { asModalProps } from 'platform/components/ModalLayer';

const cx = transformStyles(styles)

const LoginFormInput: React.FC<any> = props => {
  const { name, children } = props
  const [data, setData] = useFormState()
  const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setData({ [name]: value })
  }, [name])
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

const TLoginForm: React.FC<any> = props => {
  const { translateForm, onCloseModal } = props
  const [data, setData] = useFormState()
  const [loginType, setLoginType] = React.useState('password')
  // const [loading, setLoading] = React.useState(false);

  const [login, LoginLoading] = useGlobalAction(accountAsyncAction.login);
  const [update, updateLoading] = useGlobalAction(accountAsyncAction.getInfo);
  const loading = LoginLoading || updateLoading

  const [onLogin] = useActionCallback(async () => {
    const { account, password } = data
    await login(account, password)
    // await update()
    onCloseModal()
  }, [login, data])

  // const onLogin = React.useCallback(() => {
  //   const { account, password } = data
  //   login(account, password)
  // }, [login, data])

  React.useEffect(() => {
    setData({ password: '', verifyCode: ''})
  }, [loginType])

  const onChangeType = () => {
    setLoginType(x => x === 'password' ? 'code' : 'password')
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
      <div className={cx('login-form-btn')} onClick={onLogin}>LOGIN{loading && '...'}</div>
      <div className={cx('login-form-btn')} onClick={() => translateForm('register')}>REGISTER</div>
    </form>
  )
}

const LoginForm = enhanceFormComponent(TLoginForm)

const TRegisterForm: React.FC<any> = props => {
  const { translateForm } = props
  const [data] = useFormState()
  const onSubmit = React.useCallback((e) => {
    // console.log(7686678, data)
  }, [data])
  return (
    <form className={cx('login-form')}>
      <div className={cx('login-label')}>
        PHONE
      </div>
      <LoginFormInput name="account" />
      <div className={cx('login-label')}>
      VERIFY CODE
      </div>
      <LoginFormInput>
        <div className={cx('login-send-code')}>SEND CODE</div>
      </LoginFormInput>
      <div
        className={cx('login-back')}
        onClick={() => translateForm('login')}
      >
        Back
      </div>
      <div className={cx('login-form-btn')} onClick={onSubmit}>REGISTER</div>
    </form>
  )
}

const RegisterForm = enhanceFormComponent(TRegisterForm)

export const LoginModal: React.FC<any> = props => {
  const { setOverlay } = props
  const [ form, translateForm ] = React.useState('login')
  const onCloseModal = () => {
    setOverlay(true)
    props.onClose()
  }
  return (
    <FullScreenModal {...asModalProps(props)} onClose={onCloseModal} >
      <div className={cx('login-modal')}>
        <div className={cx('login-modal-logo')}>SMOEX</div>
        {form === 'login' && (
          <LoginForm translateForm={translateForm} onCloseModal={onCloseModal} />
        )}
        {form === 'register' && (
          <RegisterForm translateForm={translateForm}/>
        )}
      </div>
    </FullScreenModal>
  )
}
