/* eslint-disable max-len */
import React, { useState } from 'react';
import {
  AppBar, Avatar, Box, Button, Link, Popover, Toolbar, Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUserAsync } from '../../../redux/actions/authActions';
import { getUserName } from '../../../utils/getUserName';
import emojis from '../../../utils/emojis';
import { updateStatus } from '../../../redux/actions/friendsActions';

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const pages = useSelector((state) => state.pages);
  const user = useSelector((state) => state.authUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userName = getUserName(user?.email);

  const handleClick = (status) => {
    dispatch(updateStatus(status));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link color="inherit" underline="none" href="/">
              {user?.id ? `Hello, ${user?.name}!` : 'Reload'}
            </Link>
          </Typography>
          {pages?.map((page) => (<Button key={page.title} color="inherit" onClick={() => navigate(page.link)}>{page.title}</Button>))}
          {user?.id && (
            <>
              <Box mr={3}>
                <Button
                  key="logout"
                  color="inherit"
                  onClick={() => dispatch(logoutUserAsync())}
                >
                  Logout
                </Button>
              </Box>
              <Avatar alt="userName" src={`/images/${userName}.jpeg`} onClick={(e) => setAnchorEl(e.currentTarget)} />

              <Popover
                id="avatarPopover"
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Box display="flex" flexDirection="column">
                  {Object.entries(emojis).map((el) => (<Button key={el[0]} onClick={() => handleClick(el[0])}>{el[1]}</Button>))}
                </Box>
              </Popover>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
