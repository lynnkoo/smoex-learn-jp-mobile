import * as React from 'react'
import * as ReactDOM from 'react-dom'
import cx from 'classnames'
import { ID_POPUP_LAYER } from '../../utils/constants';

const createPopupLayer = (): HTMLElement => {
  const node = document.createElement('div')
  node.id = ID_POPUP_LAYER
  document.body.style.overflow = 'hidden'
  document.body.appendChild(node)
  return node
}

const removePopupLayer = (rootNode: HTMLElement) => {
  if (rootNode.children.length === 0) {
    if (!document.body.contains(rootNode)) {
      return
    }
    document.body.style.overflow = 'auto'
    document.body.removeChild(rootNode)
  }
}

function getRootNode() {
  const rootNode = document.getElementById(ID_POPUP_LAYER) || createPopupLayer()
  if (!rootNode.className) {
    rootNode.className = cx('popup-layer')
  }
  return rootNode
}

export const PopupComponent = (props: any) => {
  const { children } = props
  React.useEffect(() => {
    return () => {
      // WORKAROUND 延迟 10 毫秒关闭弹出层确保组件已经关闭并且没有新的弹窗出现
      setTimeout(() => {
        const rootNode = getRootNode()
        removePopupLayer(rootNode)
      }, 10)
    }
  })

  // if (!visible) {
  //   return null
  // }
  const rootNode = getRootNode()
  return ReactDOM.createPortal(
    <>{children}</>,
    rootNode,
    )
}

export const enhancePopupComponent = (
  WrappedComponent: any,
  layerClassName?: string,
) => (props: any) => {
  return (
    props.isOpen && (
      <PopupComponent className={layerClassName}>
        <WrappedComponent {...props} />
      </PopupComponent>
    )
  )
}
export function useVisible(visible: boolean = false): any {
  const [isVisible, setVisible] = React.useState(visible)
  const reverseRef = React.useRef(false)
  React.useEffect(() => {
    setVisible(reverseRef.current ? !visible : visible)
    reverseRef.current = false
  }, [visible])
  const onSerVisible = (v: boolean) => {
    setVisible(v)
    reverseRef.current = !reverseRef.current
  }
  return [isVisible, onSerVisible]
}

export const ModalBeta = (props: any) => {
  // console.log(defaultOpen)
  const [isVisible, setVisible] = useVisible(props.visible)
  return isVisible && (
    <PopupComponent>
      <div onClick={() => setVisible(false)}>CLOSESS</div>
      {props.children}
    </PopupComponent>
  )
}
