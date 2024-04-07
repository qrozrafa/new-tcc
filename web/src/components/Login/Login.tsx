'use client'
import { useForm } from "react-hook-form"
import { login } from "@/service/login"
import { useAuthStore } from "@/store/auth"
import { Alert, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { z } from 'zod'
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useUserStore } from "@/store/user"

type TLogin = {
  onLogin: () => void;
}

export default function Login({ onLogin }: TLogin) {
  const router = useRouter();

  const authSchema = z.object({
    email: z.string().email('Insira um endereço de e-mail válido'),
    senha: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial'),
    showPassword: z.boolean().default(false),
  });

  const useAuth = useAuthStore();
  const useUser = useUserStore();
  const { watch, formState: { errors }, clearErrors, setValue, setError } = useForm();



  const { mutate: handleSubmit, isPending: isLoading } = useMutation({
    mutationFn: async () => {
    const data = {
      email: watch('email'),
      password: watch('password')
    };

    const response = await login(data);

    if(response) {
    useAuth.setToken(response?.access_token);
    useUser.setUser(response.user);
    onLogin();
    } else {
    setError('email', { message: 'Email ou senha inválidos' });
    setError('password', { message: 'Email ou senha inválidos' });
    }

  }})

  // async function handlerUserStore() {
  //   const response = await getDataUserToken()

  //   console.log(response)
  // }

  const handleClickShowPassword = () => {
    setValue('showPassword', !watch('showPassword'));
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  function handleChangeForm(key: string, value: string) {
    setValue(key, value)
    if(errors) {
      clearErrors()
    }
  }

  return (
    <div className="w-full flex flex-col justify-center gap-4">
      <Typography variant="h6" className="text-center text-green-500" fontWeight={'bold'}>ENTRAR</Typography>
      {Object.keys(errors).length > 0 && (
        <Alert severity="error">Email ou Senha inválidos</Alert>
      )}
      <TextField
        id="outlined-size-small"
        variant="standard"
        placeholder="Digite seu email"
        label="Email:"
        type="email"
        color="success"
        value={watch('email')}
        onChange={
          (event) => {
            handleChangeForm('email', event.target.value)
            clearErrors('email')
          }
        }
        error={!!errors.email}
        size="small"
        autoFocus
        helperText={!!errors.email?.message}
       
      />
      <TextField
        id="outlined-size-small" 
        variant="standard"
        placeholder="Digite sua senha"
        label="Senha:"
        type={watch('showPassword') ? 'text' : 'password'}
        color="success"
        value={watch('password')}
        onChange={
          (event) => {
            handleChangeForm('password', event.target.value)
            clearErrors('password')
          }
        }
        error={!!errors.password}
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
        helperText={!!errors.email?.message}
      />
    <div className='flex flex-col gap-4 justify-center'>
      <Button 
        variant="contained"
        color="success"
        type="submit"
        fullWidth
        onClick={() => handleSubmit()}
        size="small"
        disabled={!watch('email') || !watch('password') || isLoading}
        className="bg-green-600 disabled:bg-zinc-500"

      >
        Entrar
      </Button>
    </div>
  </div>
  )
}