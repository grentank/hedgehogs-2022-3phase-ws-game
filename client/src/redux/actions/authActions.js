import axios from 'axios';
import { LOGOUT, SET_AUTH } from '../types';
import { setAuthPages, setPublicPages } from './pagesActions';

// Action creators
export const authLogout = () => ({ type: LOGOUT });
export const setAuth = (payload) => ({ type: SET_AUTH, payload });

// Async Thunk actions
export const checkAuthAsync = () => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth/check');
    dispatch(setAuth(res.data));
    dispatch(setAuthPages());
  } catch (e) {
    dispatch(setAuth({}));
    dispatch(setPublicPages());
    if (e.response.status === 401) {
      console.log('No session saved!');
    } else {
      console.log(e);
    }
  }
};

export const loginUserAsync = (data, setLoading) => async (dispatch) => {
  dispatch({ type: 'INIT_LOGIN' });
  try {
    const res = await axios.post('/api/auth/login', data);
    dispatch(setAuth(res.data));
    dispatch(setAuthPages());
  } catch (e) {
    setLoading(false);
    dispatch(setAuth({}));
    dispatch(setPublicPages());
    console.log('Auth failed:', e);
  }
};

export const logoutUserAsync = () => async (dispatch) => {
  try {
    await axios('/api/auth/logout');
    dispatch(authLogout());
    dispatch(setPublicPages());
    dispatch({ type: 'CLOSE_WEBSOCKET' });
  } catch (e) {
    dispatch(setAuth({}));
    dispatch(setPublicPages());
    console.log('Auth failed:', e);
  }
};

export const signupUserAsync = (data, setLoading) => async (dispatch) => {
  dispatch({ type: 'INIT_SIGNUP' });
  try {
    const res = await axios.post('/api/auth/signup', data);
    dispatch(setAuth(res.data));
    dispatch(setAuthPages());
  } catch (e) {
    setLoading(false);
    dispatch(setAuth({}));
    dispatch(setPublicPages());
    console.log('Auth failed:', e);
  }
};
