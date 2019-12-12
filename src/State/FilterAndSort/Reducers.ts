// import moment from 'moment';
// import { SET_DATE_INFO, SET_LOCATION_INFO, GET_LOCATION_DATE_INFO } from './Types';

const getInitalState = () => (
  {
    activeFilter: {}, // 有效的筛选项, // {code: true/false}
    // active
  }
);

const initalState = getInitalState();


export default (state = initalState, action = { type: '' }) => {
  switch (action.type) {
    default:
      return state;
  }
};
