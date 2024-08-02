'use client'
import { useForm } from "react-hook-form"
import { Button, IconButton, TextField } from '@mui/material'
import { z } from 'zod'
import { deleteImage, editDataUser, uploadImage } from "@/service/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserStore } from "@/store/user"
import { useMutation } from "@tanstack/react-query"
import { useContext, useState } from "react"
import { SnackbarContext } from "@/context/snackbar.context"
import Image from "next/image"
import { AccountCircle, Delete } from "@mui/icons-material"
import ModalUploadImage from "../ModalUploadImage/ModalUploadImage"

export default function EditProfile() {
  const snackbarContext = useContext(SnackbarContext);
  const useUser = useUserStore();

  const { user } = useUser;

  const [modalUploadImage, setModalUploadImage] = useState<boolean>(false);

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

  const { mutate: submitImage } = useMutation({
    mutationFn: async (file: File) => {

      const resp = await uploadImage(user?.id, { file: file });

      if(resp?.image) {
        snackbarContext.success('Imagem alterada com sucesso!');
        useUser.setUser(resp);
      } else {
        snackbarContext.error('Erro ao editar imagem');
      }
    }
  })

  async function handleRemoveImageSubject(user: string) {

    const response = await deleteImage(user as string);

    if (response) {
      snackbarContext.success('Imagem removida com sucesso!');
      useUser.setUser(response);
    } else {
      snackbarContext.error('Erro ao remover imagem');
    }
  }

  return (
    <div className="w-[300px] flex flex-col justify-center gap-4 mx-auto">
      <div className="flex justify-start">
        {user?.image ? (
          <div className="flex items-center">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/user/${user.image}`}
              alt="Imagem do perfil"
              width={100}
              height={100}
              className="rounded-full"
              unoptimized
            />
            <Button
              variant="outlined"
              color="success"
              onClick={() => setModalUploadImage(true)}
              size="small"
              sx={{ ml: 1, height: 40 }}
            >
              Alterar imagem
            </Button>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => handleRemoveImageSubject(user.id)}
            >
              <Delete />
            </IconButton>
          </div>
        ) : (
          <div className="flex items-center">
            <AccountCircle sx={{ color: 'rgb(22 163 74)', width: 100, height: 100 }} />
            <Button
              variant="outlined"
              color="success"
              onClick={() => setModalUploadImage(true)}
              size="small"
              sx={{ ml: 1, height: 40 }}
            >
              Adicionar imagem
            </Button>
          </div>
        )}
      </div>
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

      {modalUploadImage && (
        <ModalUploadImage
          open={modalUploadImage}
          handleClose={() => setModalUploadImage(false)}
          upgrade={user?.image ? true : false}
          onSelectFile={(file: File) => {
            submitImage(file);
          }}
        />
      )}
    </div>
  )
}