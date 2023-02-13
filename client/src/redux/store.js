import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './reducers/authReducer';
import friendsReducer from './reducers/friendsReducer';
import pagesReducer from './reducers/pagesReducer';
import wsReducer from './reducers/wsReducer';
import rootSaga from './sagas/rootSaga';
import gameReducer from './gameSlice';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    authUser: authReducer,
    pages: pagesReducer,
    friends: friendsReducer,
    wsStatus: wsReducer,
    game: gameReducer,
  },
  middleware: (mid) => [...mid(), sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;
