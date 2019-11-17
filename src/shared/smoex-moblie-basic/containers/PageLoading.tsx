import * as React from 'react'
import { useFooterProps } from './Pages'
import { Loading } from '../components/Loading'

export const PageLoading = () => {
  useFooterProps({ visible: false })
  return (
    <section>
      <Loading />
    </section>
  )
}
