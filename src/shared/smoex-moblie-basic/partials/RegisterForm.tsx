import * as React from 'react'
import { FullScreenModal } from '../components/FullScreenModal'
import styles from './styles/LoginModal.module.scss'
import { asModalProps } from 'shared/react-dom-basic-kit'
import { useFormState } from 'shared/react-dom-basic-kit/components/Form'
import { transformStyles } from 'shared/react-dom-basic-kit/utils'
import { enhanceFormComponent } from 'shared/react-dom-basic-kit/components/Form'
import { useActionCallback, useAsyncCallback } from 'shared/redux-async-kit'
import { accountAsyncAction } from 'shared/smoex-frontend-basic/logics/account/actions'
import { LoginFormInput } from './LoginModal'
import { commonSlice } from 'shared/smoex-frontend-basic'

const cx = transformStyles(styles)

const TRegisterForm: React.FC<any> = (props) => {
  const { translateForm } = props
  const [data] = useFormState()
  const onSubmit = React.useCallback(
    (e) => {
      // console.log(7686678, data)
    },
    [data],
  )
  return (
    <form className={cx('login-form')}>
      <div className={cx('login-label')}>PHONE</div>
      <LoginFormInput name="account" />
      <div className={cx('login-label')}>VERIFY CODE</div>
      <LoginFormInput>
        <div className={cx('login-send-code')}>SEND CODE</div>
      </LoginFormInput>
      <div className={cx('login-back')} onClick={() => translateForm('login')}>
        Back
      </div>
      <div className={cx('login-form-btn')} onClick={onSubmit}>
        REGISTER
      </div>
      <div className={cx('for-test-scroll')}>FOR TEST SCROLL</div>
      <div className={cx('for-test-scroll')}>FOR TEST SCROLL</div>
      <div className={cx('for-test-scroll')}>FOR TEST SCROLL</div>
      <div className={cx('for-test-scroll')}>FOR TEST SCROLL</div>
      <div className={cx('for-test-scroll')}>FOR TEST SCROLL</div>
      <div className={cx('for-test-scroll')}>FOR TEST SCROLL</div>
      <div className={cx('for-test-scroll')}>FOR TEST SCROLL</div>
      <div className={cx('for-test-scroll')}>FOR TEST SCROLL</div>
      <div className={cx('for-test-scroll')}>FOR TEST SCROLL</div>
      <div className={cx('for-test-scroll')}>FOR TEST SCROLL</div>
      <div className={cx('for-test-scroll')}>FOR TEST SCROLL</div>
    </form>
  )
}

export const RegisterForm = enhanceFormComponent(TRegisterForm)
