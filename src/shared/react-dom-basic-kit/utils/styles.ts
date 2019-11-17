import classNames from 'classnames'
export function transformStyles(styles: any) {
  const keyMapper = (key: string) => styles[key]
  return (...opts: any[]) => {
    const className = classNames(opts)
    return className
      .split(' ')
      .map(keyMapper)
      .join(' ')
  }
}
