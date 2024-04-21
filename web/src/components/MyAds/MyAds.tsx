import { getAdsByUser } from "@/service/profile";
import { useUserStore } from "@/store/user";
import { Divisor } from "@/styles/styles";
import { DetailAd } from "@/type/ads";
import { Delete, Edit, Mic, VideoCameraFront } from "@mui/icons-material";
import { CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useStore } from "zustand";
import DeleteAd from "../DeleteAd/DeleteAd";
import { useState } from "react";
import { weekDaysSelected } from "@/utils/utils";
import ModalFormAd from "../ModalFormAd/ModalFormAd";
import { TSubjects } from "@/type/subject";
import { useSubjectsStore } from "@/store/subjects";

export default function MyAds() {
  const useUser = useStore(useUserStore);
  const subjectsStore = useStore(useSubjectsStore);
  const [openModalDeleteAd, setOpenModalDeleteAd] = useState<boolean>(false);
  const [openModalEditAd, setOpenModalEditAd] = useState<boolean>(false);
  const [adSelected, setAdSelected] = useState<DetailAd>();
  const { user } = useUser;
  const { subjects } = subjectsStore;


  const {data: dataSubjectAds, isFetching: loadingSubjectAds } = useQuery<DetailAd[]>({
    queryKey: ['subjectAds', user?.id],
    queryFn: async () => {
      return await getAdsByUser(user?.id as string)
    },
    enabled: !!user?.id,
    staleTime: 0,
  });

  async function handleDeleteAd(ad: DetailAd) {
    await setAdSelected(ad);
    setOpenModalDeleteAd(true);
  }

  async function handleEditAd(ad: DetailAd) {
    await setAdSelected(ad);
    setOpenModalEditAd(true);
  }


  return (
    <>
      {loadingSubjectAds  && (
        <div className='flex justify-center w-full'>
          <CircularProgress color="success" />
        </div>
      )}
      {!loadingSubjectAds && dataSubjectAds && (
        <>
          {dataSubjectAds?.length > 0 && (
          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex flex-col justify-between rounded-lg`}>
            {dataSubjectAds?.map(ad => (
              <>
                <div className="flex justify-between">
                  <div className={`flex flex-col gap-1`}>
                    <Typography variant='body1'className='font-bold text-green-500'><b>{ad?.name}</b></Typography>
                    <Typography variant='body1'className="text-zinc-700">Dias: <b>{weekDaysSelected(ad?.weekDay)}</b></Typography>
                    <Typography variant='body1' className="text-zinc-700">Horário: <b>{format(ad?.hourStart, 'HH:mm')} - {format(ad?.hourEnd, 'HH:mm')}</b></Typography>
                    <div className="flex gap-1">  
                      <Tooltip title={ad.useVoice ? "Microfone disponível" : "Microfone indisponível"}>
                        <Mic className={`${ad.useVoice ? 'text-green-500' : 'text-gray-300'}`} />
                      </Tooltip>
                      <Tooltip title={ad.useVideo ? "Video disponível" : "Video indisponível"}>
                        <VideoCameraFront className={`${ad.useVideo ? 'text-green-500' : 'text-gray-300'}`} />
                      </Tooltip>
                    </div>
                  </div>
                  <div className={`flex gap-2 self-start`}>
                    <Tooltip title="Editar anúncio">
                      <IconButton color="success" onClick={() => handleEditAd(ad)}>
                        <Edit color="success"/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir anúncio" onClick={() => handleDeleteAd(ad)}>
                      <IconButton color="error" >
                        <Delete color="error"/>
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

      <DeleteAd
        open={openModalDeleteAd}
        handleClose={() => {setOpenModalDeleteAd(false)}}
        ad={adSelected}
      />

      <ModalFormAd
        open={openModalEditAd}
        ad={adSelected}
        handleClose={() => {setOpenModalEditAd(false)}}
        subjects={subjects as TSubjects[]}
      />
    </>
  )
}