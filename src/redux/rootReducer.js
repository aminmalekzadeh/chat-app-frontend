import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import chatReducer from './slices/chat';

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

// const productPersistConfig = {
//   key: 'product',
//   storage,
//   keyPrefix: 'redux-',
//   whitelist: ['sortBy', 'checkout']
// };

const rootReducer = combineReducers({
  chat: chatReducer
});

export { rootPersistConfig, rootReducer };
