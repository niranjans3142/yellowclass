import { combineReducers } from 'redux';

const counterReducer = (state=0, action) => {
  switch(action.type){
    case 'INCREMENT':
      return action.payload;
    default:
      return state;
  }
};

const stateRedux = combineReducers({
  counterReducerState: counterReducer
})

export default stateRedux;