import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore'; // syncing firestore
import { firebaseReducer } from 'react-redux-firebase';
import authReducer from './authReducer';
import wireFrameReducer from './wireFrameReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  wireFrame: wireFrameReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
});

export default rootReducer;