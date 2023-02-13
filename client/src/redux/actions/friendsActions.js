import axios from 'axios';
import { SET_FRIENDS_LIST, UPDATE_STATUS } from '../types';

// Action creators
export const setFriendsList = (payload) => ({
  type: SET_FRIENDS_LIST,
  payload,
});

export const updateStatus = (payload) => ({
  type: UPDATE_STATUS,
  payload,
});

// Async Thunk actions
export const setFriendsListAsync = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/friends/${userId}`);
    dispatch(setFriendsList(res.data));
  } catch (e) {
    dispatch(setFriendsList([]));
  }
};
