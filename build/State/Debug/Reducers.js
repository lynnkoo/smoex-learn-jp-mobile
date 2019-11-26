import { INCREMENT, DECREMENT } from './Types';
export default (state = { count: 0 }, action = { type: '' }) => {
    const actionType = action.type;
    if (actionType === INCREMENT) {
        return Object.assign(Object.assign({}, state), { count: state.count + 1 });
    }
    if (actionType === DECREMENT) {
        return Object.assign(Object.assign({}, state), { count: state.count - 1 });
    }
    return state;
};
