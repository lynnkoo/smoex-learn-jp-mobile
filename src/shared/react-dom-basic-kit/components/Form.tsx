import * as React from 'react'

export const Form: React.FC = () => {
  return null
}

const FormContext = React.createContext<any>({})

export const enhanceFormComponent = (WrappedComponent: any) => (props: any) => {
  const [formContext, setFormContext] = React.useState()
  const [formData, setFormData] = React.useState({})
  React.useEffect(() => {
    setFormContext({
      formData,
      setFormData: (data: any) => {
        setFormData((x) => ({ ...x, ...data }))
      },
    })
  }, [formData])
  return (
    <FormContext.Provider value={formContext}>
      {formContext && <WrappedComponent {...props} />}
    </FormContext.Provider>
  )
}

export function useFormState() {
  const { formData, setFormData } = React.useContext(FormContext)
  // React.useEffect(() => {
  //   if (data) {
  //     setFormData(data)
  //   }
  // }, [])
  return [formData, setFormData]
}
