import * as React from 'react'
import uuidv4 from 'uuid/v4'
import { AppContext } from './Container'
import { useLocation } from 'react-router'

const TOGGLED_MODALES = {}

export function asModalProps(props: any) {
  return {
    isOpen: props.isOpen,
    onClose: props.onClose,
    onRemove: props.onRemove,
  }
}

export function useToggleModal(modal: any, deps: any = []) {
  const { showModal, closeModal } = React.useContext(AppContext)
  const [activeModal, setActiveModal] = React.useState(null)
  const toggleModal = React.useCallback(() => {
    if (activeModal && !TOGGLED_MODALES[activeModal]) {
      setActiveModal(null)
      closeModal(activeModal)
    } else {
      if (TOGGLED_MODALES[activeModal]) {
        delete TOGGLED_MODALES[activeModal]
      }
      const modalId = showModal(modal)
      setActiveModal(modalId)
    }
  }, [activeModal, ...deps])
  return toggleModal
}

export function useModalState(modal: any, deps: any = []) {
  const { showModal, closeModal } = React.useContext(AppContext)
  const [modalId, setModalId] = React.useState()
  const onShowModal = React.useCallback(() => {
    const modalId = showModal(modal)
    setModalId(modalId)
  }, deps)
  const onCloseModal = React.useCallback(() => {
    closeModal(modalId)
  }, [modalId])
  return [onShowModal, onCloseModal]
}

export const ModalLayer: React.FC<any> = (props) => {
  const { setAppContext } = props
  const location = useLocation()
  const [modalsMap, setModalsMap] = React.useState({})
  const [hiddenModals, setHiddenModals] = React.useState([])

  React.useEffect(() => {
    setModalsMap({})
  }, [location.pathname])

  const showModal = (modal: any, id?: any) => {
    const uuid = id || uuidv4()
    setModalsMap((modals) => ({ ...modals, [uuid]: modal }))
    return uuid
  }
  const removeModal = (uuid: any) => {
    setModalsMap((modals) => {
      if (modals[uuid]) {
        delete modals[uuid]
        return { ...modals }
      }
      return modals
    })
  }

  const closeModal = (uuid: any) => {
    setHiddenModals((x) => [...x, uuid])
  }

  const onCloseBySelf = (key: any, modal: any) => () => {
    TOGGLED_MODALES[key] = modal
    closeModal(key)
  }

  React.useEffect(() => {
    setAppContext({ showModal, closeModal, removeModal })
  }, [])

  return (
    <React.Fragment>
      {Object.keys(modalsMap).map((key, i) => {
        return React.createElement(modalsMap[key], {
          key,
          isOpen: !hiddenModals.includes(key),
          onClose: onCloseBySelf(key, modalsMap[key]),
          onRemove: () => removeModal(key),
        })
      })}
    </React.Fragment>
  )
}
