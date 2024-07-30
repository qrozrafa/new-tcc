'use client'
import { useForm } from "react-hook-form"
import { forgotPassword } from "@/service/login"
import { Button, TextField, Typography } from '@mui/material'
import { z } from 'zod'
import { useMutation } from "@tanstack/react-query"
import { useContext } from "react"
import { SnackbarContext } from "@/context/snackbar.context"

type TLogin = {
  onClose: () => void;
}

export default function Forgot({ onClose }: TLogin) {

  const snackbarContext = useContext(SnackbarContext);

  const forgotSchema = z.object({
    email: z.string().email('Insira um endereço de e-mail válido'),
  });

  type formForgot = z.infer<typeof forgotSchema>

  const { watch, formState: { errors },  handleSubmit, register } = useForm<formForgot>();

  const { mutate: handleForgot, isPending: isLoading } = useMutation({
    mutationFn: async () => {
    return await forgotPassword(watch('email'));
   },
   onSuccess: () => {
    snackbarContext.success(`Email enviado! Verifique sua caixa de entrada.`);
    onClose();
   },
   onError: () => {
    snackbarContext.error(`Erro ao enviar email.`);
   }
});

  const onSubmit = handleSubmit(() => {
    handleForgot();
  })

  return (
    <div className="w-full flex flex-col justify-center gap-4">
      <Typography variant="h6" className="text-center text-green-500" fontWeight={'bold'}>ENVIAR EMAIL</Typography>
      <TextField
        id="outlined-size-small"
        variant="standard"
        placeholder="Digite seu email"
        label="Email:"
        type="email"
        color="success"
        {...register('email')}
        error={Boolean(errors.email)}
        size="small"
        autoFocus
        helperText={errors.email?.message}
       
      />
    <div className='flex flex-col gap-4 justify-center'>
      <Button 
        variant="contained"
        color="success"
        type="submit"
        fullWidth
        onClick={onSubmit}
        size="small"
        disabled={isLoading}
        className="bg-green-600 disabled:bg-zinc-500"

      >
        Enviar
      </Button>
    </div>
  </div>
  )
}