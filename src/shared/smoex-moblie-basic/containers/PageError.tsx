import * as React from 'react'
import { useFooterProps } from './Pages'

export const PageError: React.FC<any> = (props) => {
  useFooterProps({ visible: false })
  return (
    <section>
      <h1>{props.code}</h1>
    </section>
  )
}
