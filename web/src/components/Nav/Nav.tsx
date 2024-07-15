'use client'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useUserStore } from '@/store/user';
import ModalAccess from '../ModalAccess/ModalAccess';
import { Fade, Menu, MenuItem } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from 'zustand';
import Image from 'next/image';
import Logo from '../../../public/assets/images/logo.png';

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname()
  const [openModalAccess, setOpenModalAccess] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const authStore = useStore(useAuthStore);
  const { authenticated } = authStore;

  const userStore = useStore(useUserStore);
  const { user } = userStore;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='transparent' sx={{ boxShadow: 0 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <>
            <Image src={Logo} alt='logo duo study' onClick={() => router.push('/')} className='cursor-pointer' width={80} height={80}/>
          </>
          <div
            style={{ display: 'flex', alignItems: 'center'}}
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={(event) => {
              if (authenticated) {
                handleClick(event);
              }
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: 'rgb(22 163 74)', width: '100%' }}
              className='underline'
              onClick={() => {
                if (!authenticated) {
                  setOpenModalAccess(true);
                }
              }}
            >
              <span className='cursor-pointer'>{user?.name ?? 'Entrar'}</span>
            </Typography>
            <AccountCircle sx={{ color: 'rgb(22 163 74)', ml: 1 }}/>
          </div>
        </Toolbar>
      </AppBar>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      > 
        {user?.role === 'ADMIN' && (
          <MenuItem onClick={() => router.push('/painel')}>Painel</MenuItem>
        )}
        <MenuItem onClick={() => router.push('/profile')}>Perfil</MenuItem>
        <MenuItem
          onClick={() => {
            useAuthStore.getState().removeToken();
            useUserStore.getState().removeUser();
            handleClose();
            router.push('/');
          }}
        >
          Sair
        </MenuItem>
      </Menu>

      <ModalAccess
        open={openModalAccess}
        handleClose={() => setOpenModalAccess(false)}
      />
    </Box>
  );
}