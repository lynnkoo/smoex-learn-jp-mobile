import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styles from './styles/Popup.module.scss'
import { transformStyles } from '../../platform/utils/styles';

const mobileRegexp = /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/
const IS_MOBILE = mobileRegexp.test(navigator.userAgent.toLowerCase())

const cx = transformStyles(styles);

const POPUP_LAYER_ID = 'PopupLayer'
let scrolledTop = 0

const createPopupLayer = (): HTMLElement => {
  const node = document.createElement('div')
  node.id = POPUP_LAYER_ID
  node.className = cx('popup-layer');
  node.onclick = e => e.preventDefault();
  // document.body.style.overflow = 'hidden'
  scrolledTop = window.scrollY;
  document.body.className = cx('popup-locked-body')
  document.body.style.top = `-${scrolledTop}px`
  document.body.appendChild(node)
  return node
}

const removePopupLayer = (rootNode: HTMLElement) => {
  if (rootNode.children.length === 0) {
    if (!document.body.contains(rootNode)) {
      return
    }
    document.body.className = ''
    // document.body.style.overflow = 'auto'
    document.body.removeChild(rootNode)
    window.scrollTo(0, scrolledTop)
  }
}

const PopupComponent = (props: any) => {
  const rootNode = document.getElementById(POPUP_LAYER_ID) || createPopupLayer()

  React.useEffect(() => {
    return () => {
      // WORKAROUND 延迟 10 毫秒关闭弹出层确保组件已经关闭并且没有新的弹窗出现
      setTimeout(() => {
        removePopupLayer(rootNode)
      }, 10)
    }
  })

  return ReactDOM.createPortal(React.cloneElement(props.children), rootNode)
}

export type IPopupProps = {
  isOpen: boolean;
  onClose: () => void;
}

export const enhancePopupComponent = (
  WrappedComponent: any,
  layerClassName?: string,
) => (props: any) => {
  const [removed, setRemoved] = React.useState(false);
  const onRemove = () => {
    setRemoved(true)
    props.onRemove()
  }
  return !removed && (
    <PopupComponent className={layerClassName}>
      <WrappedComponent {...props} onRemove={onRemove} />
    </PopupComponent>
  )
}

export function usePopupShown(isOpen: boolean = true) {
  const [shown, setShown] = React.useState(false)
  React.useEffect(() => {
    if (!isOpen) {
      setShown(false)
    }
  }, [isOpen])
  React.useEffect(() => {
    setTimeout(() => {
      setShown(true)
    }, 10)
    return () => {
      setShown(false)
    }
  }, [])
  return shown
}
