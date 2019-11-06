import * as React from 'react'
import { useVisible, PopupComponent } from './hooks/modal'

import styles from './styles/Modal.module.scss'
import { transformStyles } from '../../platform/utils/styles';
import { enhancePopupComponent, usePopupShown } from './PopupLayer';

const cx = transformStyles(styles);

const TDrawerModal: React.FC<any> = (props: any) => {
  const { isOpen, onClose, onRemove } = props
  const shown = usePopupShown(isOpen);
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
        onClick: (e: React.MouseEvent) => e.stopPropagation()
      })}
    </div>
  )
}
export const DrawerModal = enhancePopupComponent(TDrawerModal)
