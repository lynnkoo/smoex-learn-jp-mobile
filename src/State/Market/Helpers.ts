import { LANDING_PAGE } from './Types';

export const getPageName = (landingto: string): string => {
  const to = landingto.toLocaleLowerCase();
  return (LANDING_PAGE[to] || LANDING_PAGE.DEFAULT);
};

export const getDefaultPageName = () => LANDING_PAGE.DEFAULT;

export const getParams = (data: any): any => JSON.parse(decodeURIComponent(data));

export const checkParams = (data): boolean => data && data.rentalDate && data.rentalLocation;
