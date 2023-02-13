import {
  Grid, List, ListItem, ListItemAvatar, ListItemText,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFriendsListAsync } from '../../../redux/actions/friendsActions';
import emojis from '../../../utils/emojis';
import { getUserName } from '../../../utils/getUserName';
import BadgeAvatar from '../../ui/BadgeAvatar';

export default function FriendsPage() {
  const user = useSelector((state) => state.authUser);
  const { friendsList = [], friendsOnline = [] } = useSelector((state) => state.friends);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFriendsListAsync(user.id));
  }, []);

  return (
    <Grid item xs={3}>
      <List>
        {friendsOnline.map((friend) => {
          const friendName = getUserName(friend.email);
          const isOnline = friendsOnline.map((el) => el.id).includes(friend.id);
          return (
            <ListItem key={friend.id}>
              <ListItemAvatar>
                <BadgeAvatar alt={`${friendName}`} src={`/images/${friendName}.jpeg`} isOnline />
              </ListItemAvatar>
              <ListItemText primary={`${friend.name} ${emojis[friend.status || 'happy']}`} />
            </ListItem>
          );
        })}
      </List>
    </Grid>
  );
}
