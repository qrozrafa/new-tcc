import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Login as LoginIcon, PersonAddAlt1 } from '@mui/icons-material';
import Register from '../Register/Register';
import Login from '../Login/Login';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgb(241 245 249)',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
}; 

type TModalAccess = {
  open: boolean;
  handleClose: () => void;
}

export default function ModalAccess({ open, handleClose }: TModalAccess) {

  const [tab, setTab] = useState(0);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Box sx={style}>
          <Box>
            <BottomNavigation
              showLabels
              value={tab}
              onChange={(event, newValue) => {
                setTab(newValue);
              }}
              sx={{ 
                bgcolor: 'rgb(241 245 249)',
                '& .Mui-selected': {
                  color: 'rgb(34 197 94)'
                },
                '& .MuiBottomNavigationAction-root': {
                  color: 'rgb(107 114 128)'
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgb(107 114 128)'
                },
                '& .MuiSvgIcon-selected': {
                  color: 'rgb(34 197 94)'
                }
              }}
            >
              <BottomNavigationAction label="Entrar" icon={<LoginIcon />} />
              <BottomNavigationAction label="Criar conta" icon={<PersonAddAlt1 />} />
            </BottomNavigation>
          </Box>
            {tab === 0 ? <Login onLogin={handleClose}/> : <Register onRegister={handleClose}/>}
          </Box>
        </>
      </Modal>
    </div>
  );
}