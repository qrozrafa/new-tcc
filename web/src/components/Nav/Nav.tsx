'use client'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { MouseEvent, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useUserStore } from '@/store/user';
import { Logout } from '@mui/icons-material';
import ModalAccess from '../ModalAccess/ModalAccess';

export default function Nav() {
  const [openModalAccess, setOpenModalAccess] = useState(false);
  const auth = Boolean(useAuthStore.getState().state.token)

  const user = useUserStore.getState().state.user;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='transparent'>
        <Toolbar>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            className='underline cursor-pointer'
            onClick={() => {
              if (!auth) {
                setOpenModalAccess(true);
              }
              {};
            }}
          >
            {user?.name || 'Entrar'}
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => {
                  useAuthStore.getState().actions.removeToken();
                  useUserStore.getState().actions.removeUser();
                  window.location.replace('/');
                }}
                color="inherit"
              >
                <Logout />
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <ModalAccess
        open={openModalAccess}
        handleClose={() => setOpenModalAccess(false)}
      />
    </Box>
  );
}