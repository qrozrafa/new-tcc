'use client'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useUserStore } from '@/store/user';
import ModalAccess from '../ModalAccess/ModalAccess';
import { Fade, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../../../public/assets/images/logo.png';

export default function Nav() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const authStore = useAuthStore();
  const { authenticated } = isClient ? authStore : { authenticated: false };

  const userStore = useUserStore();
  const { user } = isClient ? userStore : { user: null };

  const [openModalAccess, setOpenModalAccess] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


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
              {user?.name ?? 'Entrar'}
            </Typography>
            {user?.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/user/${user.image}`}
                alt="profile"
                width={26}
                height={26}
                className='rounded-full ml-2'
              />
            ): (
              <AccountCircle sx={{ color: 'rgb(22 163 74)', ml: 1, width: 40, height: 40 }}/>
            )}
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