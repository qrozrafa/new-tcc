'use client'
import { SnackMsgDto, SnackbarContext } from '@/context/snackbar.context';
import { Alert, Snackbar as Snack } from '@mui/material';
import { useContext, useEffect, useState } from 'react';

export default function Snackbar() {
  const snackbarContext = useContext(SnackbarContext);
  const [show, setShow] = useState<boolean>(false);
  const [msg, setMsg] = useState<SnackMsgDto | null>(null);

  useEffect(() => {
    if (!snackbarContext.msg) return;

    setMsg({ ...snackbarContext.msg });
    setShow(true);
  }, [snackbarContext.msg]);

  return (
    <Snack
      open={show}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={msg?.duration || 3000}
      onClose={() => setShow(false)}
      message={msg?.message}
      className='drop-shadow-2xl'
    >
      <Alert severity={msg?.color || 'success'}>{msg?.message}</Alert>
    </Snack>
  );
}