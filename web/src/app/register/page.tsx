'use client'
import Image from "next/image"
import Logo from '../../../public/assets/images/logo.png'
import { useForm } from "react-hook-form"
import { useAuthStore } from "@/store/auth"
import { Alert, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { z } from 'zod';
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { createUser, getDataUserToken } from "@/service/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserStore } from "@/store/user"

export default function Register() {
  const router = useRouter();
  const { actions: { setToken }, state: { token } } = useAuthStore()
  const { actions: { setUser }, state: { user } } = useUserStore()
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

  const { register, watch, formState: { errors }, clearErrors, setValue, handleSubmit } = useForm<createUserFormData>({
    resolver: zodResolver(registerAccount),
  });
  
  const handleSubmitForm = handleSubmit(async() => {
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
      setToken(response?.access_token)
      await handlerUserStore();
    }
  });

  async function handlerUserStore() {
    const response = await getDataUserToken()

    if (response) {
      setUser(response)
    }
  }

  const handleClickShowPassword = () => {
    setValue('showPassword', !watch('showPassword'));
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <div className='flex flex-col w-fit m-auto gap-8 mt-20'>
        <Image src={Logo} alt='logo duo study' style={{ alignSelf: 'center' }}/>
        <div className='flex flex-col gap-4 justify-center bg-slate-200 p-8 rounded-lg w-80'>
          <Typography variant="h5" align="center" className="text-green-500" fontWeight={700}>CRIAÇÃO DE CONTA</Typography>
          {Object.keys(errors).length > 0 && (
            Object.values(errors).map((item, index) => (
              <Alert severity="error">{item.message}</Alert>
            ))
          )}
          <TextField
            placeholder="Digite seu nome"
            label="Nome"
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
            autoFocus
            required
          />
          <TextField
            label="Email"
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
            autoFocus
            required
          />
          <TextField
            label="CPF"
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
            autoFocus
            required
            inputProps={{ maxLength: 11 }}
          />
          <TextField
            label="RA"
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
            autoFocus
            required
            inputProps={{ maxLength: 6 }}
          />
          <TextField 
            label="Senha"
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
          />
        <div className='flex flex-col gap-4 justify-center'>
          <Button 
            variant="contained"
            color="success"
            type="submit"
            fullWidth
            onClick={handleSubmitForm}
            size="small"
            onLoad={handleSubmitForm}
            className="bg-green-600"

          >
            Criar conta
          </Button>

        <Button color="info" size="small" onClick={() => router.push('/login')}>Voltar</Button>
        </div>
        </div>
      </div>
    </>
  )
}