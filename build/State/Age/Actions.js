import { SET_AGE, GET_AGE } from './Types';
export const setAge = data => ({
    type: SET_AGE,
    data,
});
export const getAge = () => ({
    type: GET_AGE,
});
