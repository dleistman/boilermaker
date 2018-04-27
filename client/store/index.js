import { createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import mapStatus from './mapStatus';
import user from './user';
import message from './message';
import game from './game';


const reducer = combineReducers({ mapStatus, user, message, game });
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  createLogger({ collapsed: true })
));
export const store = createStore(reducer, middleware);

export default store;
export * from './mapStatus';
export * from './user';
export * from './message';
export * from './game';
