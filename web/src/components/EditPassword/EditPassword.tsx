'use client'
import { useForm } from "react-hook-form"
import { Alert, Button, IconButton, InputAdornment, TextField } from '@mui/material'
import { z } from 'zod'
import { editDataUser } from "@/service/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserStore } from "@/store/user"
import { useMutation } from "@tanstack/react-query"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useContext } from "react"
import { SnackbarContext } from "@/context/snackbar.context"

export default function EditPassword() {

  const useUser = useUserStore();
  const snackbarContext = useContext(SnackbarContext);

  const { user } = useUser;

  const editData = z.object({
    currentPassword: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial'),
    newPassword: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial'),
    showPassword: z.boolean().default(false).optional(),

  });

  type createUserFormData = z.infer<typeof editData>

  const { register, watch, formState: { errors }, clearErrors, setValue, handleSubmit, setError } = useForm<createUserFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      showPassword: false,
    },
    resolver: zodResolver(editData),
  });

  const { mutate: handlePassword, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const data = {
        password: watch('currentPassword'),
        newPassword: watch('newPassword'),
      }
      
      const response = await editDataUser(user?.id, data);

      if(response) {
        snackbarContext.success('Anúncio criado com sucesso!');
      } else {
        setError('currentPassword', { message: 'Senha atual inválida' });
      }
    },
  })

  const handleClickShowPassword = () => {
    setValue('showPassword', !watch('showPassword'));
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }; 

  const onSubmit = handleSubmit(() => {
    handlePassword();
  })

  return (
    <div className="w-[300px] flex flex-col justify-center gap-4 mx-auto">
      <TextField
        id="outlined-size-small" 
        variant="standard"
        placeholder="Digite sua senha"
        label="Senha atual:"
        type={watch('showPassword') ? 'text' : 'password'}
        color="success"
        {...register('currentPassword')}
        onChange={
          () => {
            clearErrors('currentPassword')
          }
        }
        error={Boolean(errors.currentPassword)}
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {watch('showPassword') ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        helperText={errors.currentPassword?.message}
      />
      <TextField
        id="outlined-size-small" 
        variant="standard"
        placeholder="Digite sua senha"
        label="Nova senha:"
        type={watch('showPassword') ? 'text' : 'password'}
        color="success"
        {...register('newPassword')}
        onChange={
          () => {
            clearErrors('newPassword')
          }
        }
        error={Boolean(errors.newPassword)}
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {watch('showPassword') ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        helperText={errors.newPassword?.message}
      />

      <div className='flex flex-col gap-4 justify-center'>
        <Button 
          variant="contained"
          color="success"
          type="submit"
          fullWidth
          onClick={onSubmit}
          size="small"
          className="bg-green-600"
          disabled={isLoading}
        >
          Salvar
        </Button>
      </div>
    </div>
  )
}