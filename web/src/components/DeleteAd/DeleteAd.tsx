import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useContext, useEffect, useState } from 'react';
import { Button, FormControlLabel, FormGroup, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { DetailAd, TOptions } from '@/type/ads';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TSubjects } from '@/type/subject';
import { InputTime } from '../inputs/InputTime';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/store/user';
import { createAd, deleteAd } from '@/service/formAd';
import { format, set } from 'date-fns';
import { SnackbarContext } from '@/context/snackbar.context';
import { weekDaysSelected } from '@/utils/utils';
import { useStore } from 'zustand';

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
  gap: 8,
}; 

type TModalForm = {
  open: boolean;
  ad?: DetailAd;
  handleClose: () => void;
}

export default function DeleteAd({ open, ad, handleClose }: TModalForm) {
  const queryClient = useQueryClient();
  const useUser = useStore(useUserStore);
  const { user } = useUser;
  const snackbarContext = useContext(SnackbarContext);

  const { mutate: handleDeleteAd, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const response = await deleteAd(ad?.id as string);

      if(response) {
        snackbarContext.success('Anúncio excluído com sucesso!');
        handleRefresh();
        handleClose();
      } else {
        snackbarContext.error('Erro ao excluir anúncio');
      }
    },
  })

  async function handleRefresh() {
    await queryClient.refetchQueries({ queryKey: ['subjects'] });
    await queryClient.refetchQueries({ queryKey: ['subjectAds', user?.id] });
  }

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
            <Typography id="modal-modal-title" variant="h6" component="h2" className='text-black mb-3'>
              Deseja deletar o anúncio?
            </Typography>
            {ad && (
              <div className={`flex flex-col gap-1 mb-3`}>
                <Typography variant='body1'className='font-bold text-green-500'><b>{ad?.name}</b></Typography>
                <Typography variant='body1'className="text-zinc-700">Dias: <b>{weekDaysSelected(ad?.weekDay)}</b></Typography>
                <Typography variant='body1' className="text-zinc-700">Horário: <b>{format(ad?.hourStart, 'HH:mm')} - {format(ad?.hourEnd, 'HH:mm')}</b></Typography>
              </div>
            )}
            
            <div style={{display: 'flex', gap: 16, alignContent: 'center', marginBottom: 12, justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="success" onClick={handleClose}>Cancelar</Button>
              <Button variant="contained" color="error" onClick={() => handleDeleteAd()} disabled={isLoading} className='bg-red-500'>Deletar</Button>
            </div>           
          </Box>
        </>
      </Modal>
    </div>
  );
}