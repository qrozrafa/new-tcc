import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, TextField, Typography } from '@mui/material';
import { Login as LoginIcon, PersonAddAlt1 } from '@mui/icons-material';
import Register from '../Register/Register';
import Login from '../Login/Login';
import { TOptions } from '@/type/ads';
import { QueryCache, useQueryClient } from '@tanstack/react-query';
import { TSubjects } from '@/type/subject';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgb(63 63 70)',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  gap: 8,
}; 

type TModalForm = {
  open: boolean;
  handleClose: () => void;
}

export default function ModalFormAd({ open, handleClose }: TModalForm) {
  const queryClient = useQueryClient();

  const [tab, setTab] = useState(0);
  const [selectSubjects, setSelectSubjects] = useState<TOptions[]>([{label: 'Selecione a disciplina que deseja', value: ''}]);

  const subjects: TSubjects[] | undefined = queryClient.getQueryData(['subjects']);

  useEffect(() => {
    if (subjects && subjects?.length !== 0) {
      setSelectSubjects(subjects.map(subject => ({ value: subject.id, label: subject.name })));
    }
  }, [subjects]);

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
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Publique um anúncio
            </Typography>
            <TextField
              id="standard-select-currency-native"
              select
              color='success'
              label="Qual a disciplina:"
              defaultValue={{label: 'Selecione a disciplina que deseja', value: ''}}
              SelectProps={{
                native: true,
              }}
              helperText="Por favor, selecione uma disciplina"
              variant="standard"
              sx={{
                input: {color: 'white'},
                label: {color: 'white'},
                option: {
                  color: 'black',
                  borderRadius: 0,
                  backgroundColor: 'rgb(63 63 70)',
                },
                "& label.Mui-focused": {
                  color: 'white',
                },
                "& .MuiNativeSelect-select": {
                  color: 'white',
                  backgroundColor: 'rgb(63 63 70)',
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: 'rgb(63 63 70)',
                },
                '.MuiSvgIcon-root ': {
                  fill: "white !important",
                }
              }}
              className='w-full bg-zinc-700'
            >
              {selectSubjects.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Box>
        </>
      </Modal>
    </div>
  );
}