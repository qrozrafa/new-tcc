'use client'
import { useForm } from "react-hook-form"
import { useAuthStore } from "@/store/auth"
import { Alert, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { z } from 'zod'
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { createUser, getDataUserToken } from "@/service/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserStore } from "@/store/user"
import { useMutation } from "@tanstack/react-query"
import { login } from "@/service/login"

type TRegister =  {
  onRegister: () => void;
}

export default function Register({ onRegister }: TRegister) {
  const router = useRouter();
  const useAuth = useAuthStore();
  const useUser = useUserStore();

  const registerAccount = z.object({
    name: z.string().min(4, 'Insira o seu nome'),
    email: z.string().email('Insira um endereço de e-mail válido'),
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial'),
    showPassword: z.boolean().default(false),
    cpf: z.string().min(11, 'Insira o seu CPF'),
    ra: z.string().min(6, 'Insira o seu RA'),
  });

  type createUserFormData = z.infer<typeof registerAccount>

  const { register, watch, formState: { errors }, clearErrors, setValue, handleSubmit, setError } = useForm<createUserFormData>({
    resolver: zodResolver(registerAccount),
  });

  const { mutate: handleRegister, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const data = {
        name: watch('name'),
        email: watch('email'),
        password: watch('password'),
        cpf: watch('cpf'),
        ra: watch('ra'),
        role: 'USER'
      }
      
      const response = await createUser(data);

      if(response) {
        useAuth.setToken(response?.access_token)
      }
    },
    onSuccess: async () => {
      const data = {
        email: watch('email'),
        password: watch('password')
      };
  
      const response = await login(data);
  
      if(response) {
      useAuth.setToken(response?.access_token);
      useUser.setUser(response.user);
      onRegister();
      } 
    },
    onError: (data) => {
      setError('root', { message: data.message});
    }
  })

  const handleClickShowPassword = () => {
    setValue('showPassword', !watch('showPassword'));
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full flex flex-col justify-center gap-4">
      <Typography variant="h5" align="center" className="text-green-500" fontWeight={700}>CRIAÇÃO DE CONTA</Typography>
      {Object.keys(errors).length > 0 && (
        Object.values(errors).map((item, index) => (
          <Alert severity="error">{item.message}</Alert>
        ))
      )}
      <TextField
        variant="standard"
        placeholder="Digite seu nome"
        label="Nome:"
        type="text"
        color="success"
        {...register('name')}
        onChange={
          () => {
            clearErrors('name')
          }
        }
        error={!!errors.name}
        size="small"
        required
        autoFocus
      />
      <TextField
        variant="standard"
        label="Email:"
        placeholder="Digite seu email"
        type="email"
        color="success"
        {...register('email')}
        onChange={
          () => {
            clearErrors('email')
          }
        }
        error={!!errors.email}
        size="small"
        required
      />
      <TextField
        variant="standard"
        label="CPF:"
        placeholder="Digite seu CPF"
        type="text"
        color="success"
        {...register('cpf')}
        onChange={
          () => {
            clearErrors('cpf')
          }
        }
        error={!!errors.cpf}
        size="small"
        required
        inputProps={{ maxLength: 11 }}
      />
      <TextField
        variant="standard"
        label="RA:"
        placeholder="Digite seu RA"
        type="text"
        color="success"
        {...register('ra')}
        onChange={
          () => {
            clearErrors('ra')
          }
        }
        error={!!errors.ra}
        size="small"
        required
        inputProps={{ maxLength: 6 }}
      />
      <TextField
        variant="standard"
        label="Senha:"
        placeholder="Digite sua senha"
        type={watch('showPassword') ? 'text' : 'password'}
        color="success"
        {...register('password')}
        onChange={
          () => {
            clearErrors('password')
          }
        }
        error={!!errors.password}
        size="small"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility:"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {watch('showPassword') ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <div className='flex flex-col gap-4 justify-center'>
        <Button 
          variant="contained"
          color="success"
          type="submit"
          fullWidth
          onClick={() => handleRegister()}
          size="small"
          className="bg-green-600"
          disabled={!isLoading}
        >
          Criar conta
        </Button>
      </div>
    </div>
  )
}