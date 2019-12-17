// import { allCars } from '../Pages/List/Texts';
import { getSharkValue } from '@ctrip/bbk-shark';

// This file is used to define a fixed configuration for some front ends

export const AgeConfig = {
  DEFAULT_AGE: {
    val: '30-60',
    min: 30,
    max: 60,
  },
  MIN_AGE: 18,
  MAX_AGE: 99,
};

export const AllCarsConfig = {
  groupCode: 'all',
  groupName: getSharkValue('list_allCars'),
};

export const CountryDefaultConfig = {
  countryId: 66,
  countryCode: 'US',
  countryName: 'United States',
};

export default {
  AgeConfig,
  AllCarsConfig,
  CountryDefaultConfig,
};
