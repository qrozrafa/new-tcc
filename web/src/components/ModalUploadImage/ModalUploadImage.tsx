import { SnackbarContext } from "@/context/snackbar.context";
import { editSubject, uploadImage } from "@/service/subject";
import { TSubjects } from "@/type/subject";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { Delete } from "@mui/icons-material";

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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

type TModalEditSubject = {
  open: boolean;
  subject: TSubjects;
  handleClose: () => void;
}
export default function ModalUploadImage({open, subject, handleClose }: TModalEditSubject) {
  const queryClient = useQueryClient();
  const snackbarContext = useContext(SnackbarContext);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const onDeleteFileHandler = () => {
    setFile(null);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = "";
    }
  };

  async function handleRefresh() {
    await queryClient.refetchQueries({ queryKey: ['subjects'] });
    await queryClient.refetchQueries({ queryKey: ['allSubjects'] });
  }

  const { mutate: submitImage, isPending: isLoading } = useMutation({
    mutationFn: async () => {

      await uploadImage(subject?.id, { file: file });

    },
    onSuccess: async () => {
      snackbarContext.success('Upload de imagem com sucesso!');
      await handleRefresh();
      handleClose();
    },
    onError: (data) => {
      snackbarContext.error(data.message);
    }
  })

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
            handleClose();
          }
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" className='text-green-500 mb-3'>
              {subject?.image ? 'Alterar imagem' : 'Adicionar imagem'}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }} className="text-gray-600">
              {subject?.image ? `Alterar a imagem para a disciplina ${subject?.name}` :  `Escolha uma imagem para a disciplina ${subject?.name}`}
            </Typography>
            <div style={{display: 'flex', flexDirection: 'column', gap: 32, margin: `32px 0 0`}}>
            <div className="flex w-full items-center">
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                color="success"
                className="w-full"
                startIcon={<CloudUploadIcon />}
              >
                <VisuallyHiddenInput
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                hidden
                />
                <div className="file-name">
                  {file ? <div>{file?.name}</div> : <div>{subject.image ? 'Alterar imagem' : 'Selecionar imagem'}</div>}
                </div>
              </Button>
              <div>
                <IconButton
                  aria-label="delete"
                  disabled={!file}
                  color="error"
                  onClick={onDeleteFileHandler}
                >
                  <Delete />
                </IconButton>
              </div>
            </div>
                <div style={{display: 'flex', gap: 16, alignContent: 'center', marginBottom: 32, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" color="success" onClick={handleClose}>Cancelar</Button>
                  <Button variant="contained" color="success" onClick={() => submitImage()} disabled={isLoading || !file} className='bg-green-500'>Salvar</Button>
                </div>
            </div>
          </Box>
        </>
      </Modal>
    </>
  )
}