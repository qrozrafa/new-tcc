'use client'
import { useForm } from "react-hook-form"
import { Alert, Button, TextField } from '@mui/material'
import { z } from 'zod'
import { editDataUser } from "@/service/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserStore } from "@/store/user"
import { useMutation } from "@tanstack/react-query"
import { useContext } from "react"
import { SnackbarContext } from "@/context/snackbar.context"

export default function EditProfile() {
  const snackbarContext = useContext(SnackbarContext);
  const useUser = useUserStore();

  const { user } = useUser;

  const editData = z.object({
    name: z.string().min(4, 'Insira o seu nome'),
    email: z.string().email('Insira um endereço de e-mail válido'),
    cpf: z.string().min(11, 'Insira o seu CPF'),
    ra: z.string().min(6, 'Insira o seu RA'),
    role: z.string().default('USER').optional(),
  });

  type createUserFormData = z.infer<typeof editData>

  const { register, watch, formState: { errors }, clearErrors, setValue, handleSubmit, setError } = useForm<createUserFormData>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      cpf: user?.cpf,
      ra: user?.ra,
      role: user?.role,
    },
    resolver: zodResolver(editData),
  });

  const { mutate: handleRegister, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const data = {
        name: watch('name'),
        email: watch('email'),
        cpf: watch('cpf'),
        ra: watch('ra'),
        role: watch('role'),
      }
      
      const response = await editDataUser(user?.id, data);

      if(response) {
        useUser.setUser(response)
      }
    },
    onSuccess: () => {
      snackbarContext.success('Perfil editados com sucesso!');
    },
    onError: () => {
      snackbarContext.error('Erro ao editar perfil');
    }
  })

  const onSubmit = handleSubmit(() => {
    handleRegister()
  })


  return (
    <div className="w-[300px] flex flex-col justify-center gap-4 mx-auto">
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
        error={Boolean(errors.name)}
        helperText={errors.name?.message}
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
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
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
        error={Boolean(errors.cpf)}
        helperText={errors.cpf?.message}
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
        error={Boolean(errors.ra)}
        helperText={errors.ra?.message}
        size="small"
        required
        inputProps={{ maxLength: 6 }}
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