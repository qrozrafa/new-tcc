import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef, useState } from "react";
import styled from "styled-components";
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
  upgrade?: boolean;
  handleClose: () => void;
  onSelectFile: (event: File) => void;
}
export default function ModalUploadImage({open, upgrade, handleClose, onSelectFile }: TModalEditSubject) {
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

  const handleSubmit = () => {
    if (file) {
      onSelectFile(file);
      handleClose();
    }
  };

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
              {upgrade ? 'Alterar imagem' : 'Adicionar imagem'}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }} className="text-gray-600">
              {upgrade ? `Alterar a imagem` :  `Escolha uma imagem`}
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
                    {file ? <div>{file?.name}</div> : <div>{upgrade ? 'Alterar imagem' : 'Selecionar imagem'}</div>}
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
                <Button variant="contained" color="success" onClick={handleSubmit} disabled={!file} className='bg-green-500'>Salvar</Button>
              </div>
            </div>
          </Box>
        </>
      </Modal>
    </>
  )
}