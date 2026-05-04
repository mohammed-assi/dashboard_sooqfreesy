import { combineReducers } from 'redux';
import { authReducer } from '../slices/auth/authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;