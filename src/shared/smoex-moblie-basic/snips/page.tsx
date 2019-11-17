import * as React from 'react'
import { transformStyles } from 'shared/react-dom-basic-kit/utils'

import styles from './TempPage.module.scss'
const cx = transformStyles(styles)

// name = Temp
type ITempPageProps = {
  className?: string
}

export const TempPage: React.FC<ITempPageProps> = (props) => {
  const { className } = props
  return <div className={cx('temp-page')}>TEMP</div>
}
