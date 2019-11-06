import { createHomeSlice } from 'common/slices/home';

export const HomeSlice = createHomeSlice({
  loader: () => import('./HomePage' /* webpackChunkName: "home" */),
})

export const SearchSlice = createHomeSlice({
  loader: () => import('./SearchPage' /* webpackChunkName: "search" */),
})
