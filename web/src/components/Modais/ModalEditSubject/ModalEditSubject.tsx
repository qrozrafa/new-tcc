import { SnackbarContext } from "@/context/snackbar.context";
import { createSubject, editSubject } from "@/service/subject";
import { TSubjects } from "@/type/subject";
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

type TModalEditSubject = {
  open: boolean;
  subject?: TSubjects;
  handleClose: () => void;
}
export default function ModalEditSubject({open, subject, handleClose}: TModalEditSubject) {
  const queryClient = useQueryClient();
  const snackbarContext = useContext(SnackbarContext);

  const formSubject = z.object({
    name: z.string().nonempty('Insira o nome da disciplina'),
  });

  type createFormSubject = z.infer<typeof formSubject>

  const initialValues = {
    name: subject?.name ?? '',
  }

  const { register, watch, formState: { errors }, clearErrors, setValue, handleSubmit, setError, reset } = useForm<createFormSubject>({
    defaultValues: initialValues,
    resolver: zodResolver(formSubject),
  });

  const { mutate: submitFormAd, isPending: isLoading } = useMutation({
    mutationFn: async () => {

      const data = {
        name: watch('name'),
      };

      if (subject?.id) {
        await editSubject(subject?.id, data);
      } else {
        await createSubject(data);
      }

    },
    onSuccess: async () => {
      snackbarContext.success('Disciplina editado com sucesso!');
      await handleRefresh();
      handleClose();
    },
    onError: (data) => {
      setError('root', { message: data.message});
      snackbarContext.error(data.message);
    }
  })

  async function handleRefresh() {
    await queryClient.refetchQueries({ queryKey: ['subjects'] });
    await queryClient.refetchQueries({ queryKey: ['allSubjects'] });
  }

  const onSubmit = handleSubmit(() => {
    submitFormAd();
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
              {subject?.id ? `Editar disciplina ${subject?.name}` : 'Criar disciplina'}
            </Typography>
            <div style={{display: 'flex', flexDirection: 'column', gap: 32, margin: `32px 0 0`}}>
              <TextField
                  id="outlined-size-small"
                  variant="standard"
                  placeholder="Digite o nome da disciplina"
                  label="Nome da disciplina:"
                  type="text"
                  color="success"
                  {...register('name')}
                  onChange={
                    () => {
                      clearErrors('name');
                    }
                  }
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  size="small"
                  required
                />
                <div style={{display: 'flex', gap: 16, alignContent: 'center', marginBottom: 32, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" color="success" onClick={handleClose}>Cancelar</Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={onSubmit}
                    disabled={isLoading}
                    className='bg-green-500'
                  >
                    {subject?.id ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
            </div>
          </Box>
        </>
      </Modal>
    </>
  )
}