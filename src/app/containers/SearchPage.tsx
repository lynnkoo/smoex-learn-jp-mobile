import * as React from 'react'

import styles from './styles/SearchPage.module.scss'
import { transformStyles } from 'shared/react-dom-basic-kit/utils'
const cx = transformStyles(styles)

type ISearchPageProps = {}

export const SearchPage: React.FC<ISearchPageProps> = (props: any) => {
  return (
    <div className={cx('search-page')}>
      Search Page
      <div className={cx('search-item')}>Search item for scroll </div>
      <div className={cx('search-item')}>Search item for scroll </div>
      <div className={cx('search-item')}>Search item for scroll </div>
      <div className={cx('search-item')}>Search item for scroll </div>
      <div className={cx('search-item')}>Search item for scroll </div>
      <div className={cx('search-item')}>Search item for scroll </div>
      <div className={cx('search-item')}>Search item for scroll </div>
      <div className={cx('search-item')}>Search item for scroll </div>
      <div className={cx('search-item')}>Search item for scroll </div>
      <div className={cx('search-item')}>Search item for scroll </div>
    </div>
  )
}

export default SearchPage
