import { SnackbarContext } from "@/context/snackbar.context";
import { activeSubject, disableSubject, getAllSubjects } from "@/service/subject";
import { Divisor } from "@/styles/styles";
import { TSubjects } from "@/type/subject";
import { Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import ModalEditSubject from "../ModalEditSubject/ModalEditSubject";

export default function ListSubjects() {
  const queryClient = useQueryClient();
  const snackbarContext = useContext(SnackbarContext);
  const [openModalEditSubject, setOpenModalEditSubject] = useState<boolean>(false);
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

  return (
    <>
      {loadingSubjects  && (
        <div className='flex justify-center w-full'>
          <CircularProgress color="success" />
        </div>
      )}
      {!loadingSubjects && subjects && (
        <>
          {subjects?.length > 0 && (
          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex flex-col justify-between rounded-lg`}>
            {subjects?.map(subject => (
              <>
                <div className="flex justify-between">
                  <div className={`flex flex-col`}>
                    <Typography variant='body1'className='font-bold text-green-500'><b>{subject.name}</b></Typography>
                    <Typography variant='body2'className="text-zinc-400">{subject.countAds}{subject.countAds > 1 ? ' anúncios' : ' anúncio'}</Typography>
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
                  </div>
                </div>
                <Divisor />
              </>
            ))}
          </div>
        )}
        </>
      )}

      {openModalEditSubject && subject && (
        <ModalEditSubject
          subject={subject}
          open={openModalEditSubject}
          handleClose={() => setOpenModalEditSubject(false)}
        />
      )}
    </>
  )
}