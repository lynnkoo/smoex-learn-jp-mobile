import { PageId } from '../../Constants/Index';

export const LOAD = 'Market/LOAD';
export const LOAD_COMPLETED = 'Market/LOAD_COMPLETED';
export const LOAD_FAILED = 'Market/LOAD_FAILED';

// market type
export const LOADING_TYPE = {
  SERVER: 'ser',
  CLIENT: 'client',
};

export const FROM_URL = {
  SEO: 'seo',
  COMM: 'comm',
  CTLIST: 'ctlist',
};

export const LANDING_PAGE = {
  list: PageId.Index.EN,
  DEFAULT: PageId.Debug.EN,
};
