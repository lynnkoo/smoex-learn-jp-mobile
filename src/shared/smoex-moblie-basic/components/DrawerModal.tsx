import * as React from 'react'
import styles from './styles/Modal.module.scss'
import {
  enhancePopupComponent,
  usePopupShown,
} from 'shared/react-dom-basic-kit/components/Popup'

import { transformStyles } from 'shared/react-dom-basic-kit/utils'

const cx = transformStyles(styles)

const TDrawerModal: React.FC<any> = (props: any) => {
  const { isOpen, onClose, onRemove } = props
  const shown = usePopupShown(isOpen)
  const onTransitionEnd = React.useCallback(() => {
    if (!shown) {
      onRemove()
    }
  }, [shown])
  return (
    <div
      className={cx('drawer-modal', { shown })}
      onClick={onClose}
      onTransitionEnd={onTransitionEnd}
    >
      {React.cloneElement(props.children, {
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
      })}
    </div>
  )
}

export const DrawerModal = enhancePopupComponent(TDrawerModal)
