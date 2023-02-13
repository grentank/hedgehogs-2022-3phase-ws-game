import { all } from 'redux-saga/effects';
import initWebSocketWatcher from './friendsWatcherSaga';

export default function* rootSaga() {
  yield all([initWebSocketWatcher()]);
}
