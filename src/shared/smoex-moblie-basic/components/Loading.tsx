import * as React from 'react'
import styles from './styles/Loading.module.scss'
import { transformStyles } from 'shared/react-dom-basic-kit/utils'
import LoadingSVG from '../assets/loading.svg'

const cx = transformStyles(styles)

export const Loading: React.FC = () => {
  return <img className={cx('loading')} src={LoadingSVG} />
}
