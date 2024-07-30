import { SnackbarContext } from "@/context/snackbar.context";
import { activeSubject, deleteImage, disableSubject, getAllSubjects } from "@/service/subject";
import { Divisor } from "@/styles/styles";
import { TSubjects } from "@/type/subject";
import { Edit, Visibility, VisibilityOff, Image as ImageIcon, HideImage } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import ModalEditSubject from "../ModalEditSubject/ModalEditSubject";
import Image from "next/image";

import notImg from '../../../public/assets/images/No Image.png';
import ModalUploadImage from "../ModalUploadImage/ModalUploadImage";

export default function ListSubjects() {
  const queryClient = useQueryClient();
  const snackbarContext = useContext(SnackbarContext);
  const [openModalEditSubject, setOpenModalEditSubject] = useState<boolean>(false);
  const [openModalEditImage, setOpenModalEditImage] = useState<boolean>(false);
  const [subject, setSubject] = useState<TSubjects>();

  const { data: subjects, isFetching: loadingSubjects } = useQuery<TSubjects[]>({
    queryKey: ['allSubjects'],
    queryFn: async () => {
      return await getAllSubjects();
    },
  });

  async function handleVisibleSubjects(subject: TSubjects) {
    if (subject.status === 'ACTIVE') { 
      await disableSubject(subject.id as string);
      snackbarContext.success('Diciplina disabilidata com sucesso!');
    } else {
      await activeSubject(subject.id as string);
      snackbarContext.success('Diciplina habilitada com sucesso!');
    }
    await queryClient.refetchQueries({ queryKey: ['subjects'] });
    await queryClient.refetchQueries({ queryKey: ['allSubjects'] });
  }

  async function handleSubject(subject: TSubjects) {
    await setSubject(subject);
    setOpenModalEditSubject(true);
  }

  async function handleImageSubject(subject: TSubjects) {
    await setSubject(subject);
    setOpenModalEditImage(true);
  }

  async function handleRemoveImageSubject(subject: string) {

    const response = await deleteImage(subject as string);

    if (response) {
      snackbarContext.success('Imagem removida com sucesso!');
      await queryClient.refetchQueries({ queryKey: ['subjects'] });
      await queryClient.refetchQueries({ queryKey: ['allSubjects'] });
    } else {
      snackbarContext.error('Erro ao remover imagem');
    }
  }

  return (
    <>
      {loadingSubjects  && (
        <div className='flex justify-center w-full'>
          <CircularProgress color="success" />
        </div>
      )}
      {!loadingSubjects && subjects && (
        <>
          <div className="flex justify-end w-full">
            <Button
              variant='contained'
              color='success'
              size='small'
              sx={{ width: 160 }}
              className='bg-green-500'
              onClick={() => setOpenModalEditSubject(true)}
            >
              Adicionar diciplina
            </Button>
          </div>
          {subjects?.length > 0 && (
          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex flex-col justify-between rounded-lg`}>
            {subjects?.map(subject => (
              <>
                <div className="flex justify-between flex-wrap">
                  <div className={`flex gap-2 items-center`}>
                    <Image alt='' src={subject.image ? `${process.env.NEXT_PUBLIC_BASE_URL}/storage/subject/${subject.image}` : notImg} width={26} height={26} className='self-center py-4'/>
                    <div className={`flex flex-col`}>
                      <Typography variant='body1'className='font-bold text-green-500'><b>{subject.name}</b></Typography>
                      <Typography variant='body2'className="text-zinc-400">{subject.countAds}{subject.countAds > 1 ? ' anúncios' : ' anúncio'}</Typography>
                    </div>
                  </div>
                  <div className={`flex gap-2 self-start`}>
                    <Tooltip title="Editar diciplina">
                      <IconButton color="success" onClick={() => handleSubject(subject)}>
                        <Edit color="disabled"/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={subject.status === 'ACTIVE' ? 'Desabilitar diciplina' : 'Habilitar diciplina'}>
                      <IconButton color="success"  onClick={() => handleVisibleSubjects(subject)}>
                        {subject.status === 'ACTIVE' ? <Visibility color="disabled"/> : <VisibilityOff color="disabled"/>}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={subject.image ? 'Alterar imagem' : 'Adicionar imagem'}>
                      <IconButton color="success"  onClick={() => handleImageSubject(subject)}>
                         <ImageIcon color="disabled"/>
                      </IconButton>
                    </Tooltip>
                    {subject.image && (
                      <Tooltip title="Remover imagem">
                        <IconButton color="success"  onClick={() => handleRemoveImageSubject(subject.id)}>
                          <HideImage color="disabled"/>
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <Divisor />
              </>
            ))}
          </div>
        )}
        </>
      )}

      {openModalEditSubject && (
        <ModalEditSubject
          subject={subject}
          open={openModalEditSubject}
          handleClose={() => setOpenModalEditSubject(false)}
        />
      )}

      {openModalEditImage && subject && (
        <ModalUploadImage
          subject={subject}
          open={openModalEditImage}
          handleClose={() => setOpenModalEditImage(false)}
        />
      )}

    </>
  )
}