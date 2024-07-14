'use client'
import { Layout } from "@/components/layout";
import { getSubject, getSubjectAds } from "@/service/subject";
import { Divisor } from "@/styles/styles";
import { DetailAd } from "@/type/ads";
import { TSubjects } from "@/type/subject";
import { weekDays } from "@/utils/constants";
import { Delete, Edit, Mic, Search, VideoCameraFront } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { format } from 'date-fns';
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { NotFoundAd } from "@/components/NotFoundAd/NotFoundAd";
import { useStore } from "zustand";
import DeleteAd from "@/components/DeleteAd/DeleteAd";
import ModalFormAd from "@/components/ModalFormAd/ModalFormAd";
import { useSubjectsStore } from "@/store/subjects";
import { useUserStore } from "@/store/user";

export default function Subject() {
  const param = useParams();
  const subjectsStore = useStore(useSubjectsStore);
  const authStore = useStore(useAuthStore);
  const userStore = useStore(useUserStore);

  const [search, setSearch] = useState('');
  const [ads, setAds] = useState<DetailAd[]>([]);
  const [openModalDeleteAd, setOpenModalDeleteAd] = useState<boolean>(false);
  const [openModalEditAd, setOpenModalEditAd] = useState<boolean>(false);
  const [adSelected, setAdSelected] = useState<DetailAd>();
  const { authenticated } = authStore;
  const { subjects } = subjectsStore;
  const { user } = userStore;


  const { data: subject, isFetching: loadingSubject } = useQuery<TSubjects>({
    queryKey: ['subject', param.id],
    queryFn: async () => {
      return await getSubject(param.id as string)
    },
    enabled: true,
    staleTime: 0,
  });

  const {isFetching: loadingSubjectAds, refetch } = useQuery<DetailAd[]>({
    queryKey: ['subjectAds', param.id as string],
    queryFn: async () => {
      const resp =  await getSubjectAds(param.id as string);
      await setAds(resp)
      return []
    },
    enabled: true,
    staleTime: 0,
  });
  
  function weekDaysSelected(days: string[]): string {
    const daysSeletected = days.map(day => `${weekDays[day]}`);
    let daysFormated: string;
    
    if (daysSeletected.length === 1) {
      daysFormated = daysSeletected[0];
    } else {
      daysFormated = daysSeletected.slice(0, -1).join(', ') + ' e ' + daysSeletected[daysSeletected.length - 1];
    }
    return daysFormated;
  }
  
  const filteredAds = ads?.filter(ad => {
    return ad.nameAd.toLowerCase().includes(search.toLowerCase())
  })
  
  async function handleDeleteAd(ad: DetailAd) {
    await setAdSelected(ad);
    setOpenModalDeleteAd(true);
  }
  
  async function handleEditAd(ad: DetailAd) {
    await setAdSelected(ad);
    setOpenModalEditAd(true);
  }

  return (
    <Layout>
      {loadingSubjectAds || loadingSubject && (
        <div className='flex justify-center w-full'>
          <CircularProgress color="success" />
        </div>
      )}
      {!loadingSubject && !loadingSubjectAds && (
        <div className='flex flex-col gap-4 justify-center p-8'>
          <Typography variant='h4' className='text-zinc-700 text-center font-bold'>Encontre seu colega de estudo em <span className='text-green-500 font-bold'>{subject?.name}</span></Typography>

          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex justify-between rounded-lg`}>
            <TextField
              variant="standard"
              color="success"
              placeholder="Digita a matéria"
              className="w-full border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />            
            <div className={`self-center`}>
              <Search color="success"/>
            </div>
          </div>

          {filteredAds?.length === 0 && (
            <NotFoundAd subjects={subjects} subjectId={param.id as string}/>
          )}

          {filteredAds?.length > 0 && (
            <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex flex-col justify-between rounded-lg`}>
              {filteredAds?.map(ad => (
                <>
                  <div className="flex justify-between">
                    <div className={`flex flex-col gap-1`}>
                      <Typography variant='body1'className='font-bold text-green-500'><b>{ad.name}</b></Typography>
                      <Typography variant='body1' className="text-zinc-700">Nome: <b>{ad.nameUser}</b></Typography>
                      <Typography variant='body1'className="text-zinc-700">Dias: <b>{weekDaysSelected(ad.weekDay)}</b></Typography>
                      <Typography variant='body1' className="text-zinc-700">Horário: <b>{format(ad.hourStart, 'HH:mm')} - {format(ad.hourEnd, 'HH:mm')}</b></Typography>
                      <div className="flex gap-1">
                      <Tooltip title={ad.useVoice ? "Microfone disponível" : "Microfone indisponível"}>
                        <Mic className={`${ad.useVoice ? 'text-green-500' : 'text-gray-300'}`} />
                      </Tooltip>
                      <Tooltip title={ad.useVideo ? "Video disponível" : "Video indisponível"}>
                        <VideoCameraFront className={`${ad.useVideo ? 'text-green-500' : 'text-gray-300'}`} />
                      </Tooltip>
                      </div>
                    </div>
                    <div className={`flex flex-col ${user?.id === ad.userId || user?.role === 'ADMIN' ? 'justify-between' : 'justify-end'}`}>
                      {(user?.id === ad.userId || user?.role === 'ADMIN') && (
                        <div className={`flex gap-2 self-start`}>
                          <Tooltip title="Editar anúncio">
                            <IconButton color="success" onClick={() => handleEditAd(ad)}>
                              <Edit color="success"/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir anúncio">
                            <IconButton color="error" onClick={() => handleDeleteAd(ad)}>
                              <Delete color="error"/>
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                      <div className={`self-end`}>
                        {user?.id !== ad.userId && (  
                          <Button
                            variant='contained'
                            color='success'
                            size='small'
                            disabled={!authenticated}
                            className="bg-green-500"
                          >
                            Conectar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Divisor />
                </>
              ))}
            </div>
          )}
        </div>
      )}
      <DeleteAd
        open={openModalDeleteAd}
        handleClose={() => {setOpenModalDeleteAd(false); refetch()}}
        ad={adSelected}
      />

      <ModalFormAd
        open={openModalEditAd}
        ad={adSelected}
        handleClose={() => {setOpenModalEditAd(false); refetch()}}
        subjects={subjects as TSubjects[]}
      />
    </Layout>
  )
}