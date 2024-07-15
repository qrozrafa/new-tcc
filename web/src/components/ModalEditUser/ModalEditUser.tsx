import { SnackbarContext } from "@/context/snackbar.context";
import { editDataUser } from "@/service/user";
import { UserData, useUserStore } from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

type TModalEditUser = {
  open: boolean;
  user: UserData;
  handleClose: () => void;
}

export default function ModalEditUser({open, user, handleClose}: TModalEditUser) {

  const snackbarContext = useContext(SnackbarContext);
  const queryClient = useQueryClient();

  const editData = z.object({
    name: z.string().min(4, 'Insira o seu nome'),
    email: z.string().email('Insira um endereço de e-mail válido'),
    cpf: z.string().min(11, 'Insira o seu CPF'),
    ra: z.string().min(6, 'Insira o seu RA'),
    role: z.string().default('USER').optional(),
  });

  type createUserFormData = z.infer<typeof editData>

  const { register, watch, formState: { errors }, clearErrors, setValue, reset, handleSubmit, setError } = useForm<createUserFormData>({
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
      
      await editDataUser(user?.id, data);

    },
    onSuccess: async() => {
      snackbarContext.success('Perfil editados com sucesso!');
      await queryClient.refetchQueries({ queryKey: ['users'] });
      handleClose();
    },
    onError: () => {
      snackbarContext.error('Erro ao editar perfil');
    }
  })
  return (
    <>
      <Modal
        open={open}
        onClose={() => {
            handleClose();
            reset();  
          }
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" className='text-green-500 mb-3'>
              Editar o usuário {user?.name}
            </Typography>
            <div style={{display: 'flex', flexDirection: 'column', gap: 32, margin: `32px 0 0`}}>
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
                <div style={{display: 'flex', gap: 16, alignContent: 'center', marginBottom: 32, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" color="success" onClick={handleClose}>Cancelar</Button>
                  <Button variant="contained" color="success" onClick={() => handleRegister()} disabled={isLoading} className='bg-green-500'>Salvar</Button>
                </div>
            </div>
          </Box>
        </>
      </Modal>
    </>
  );
}