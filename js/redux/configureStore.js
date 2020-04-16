import { createStore, applyMiddleware, compose } from 'redux';
//import rootReducer from './reducers';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
//import { logger } from "redux-logger";
import thunk from 'redux-thunk';

let store = null;

export function configureStore(intialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; //add support for Redux dev tools

  store = createStore(
    rootReducer,
    intialState,
    composeEnhancers(applyMiddleware(thunk, reduxImmutableStateInvariant())) // warn us if accidentally mutate Redux state
  );
  return store;
}

export default function getStore() {

  if (!store) {
    store = configureStore();
  }

  return store;
}
