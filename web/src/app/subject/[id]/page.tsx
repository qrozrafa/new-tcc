'use client'
import { Layout } from "@/components/layout";
import { getSubject, getSubjectAds } from "@/service/subject";
import { Divisor } from "@/styles/styles";
import { TAd } from "@/type/ads";
import { TSubjects } from "@/type/subject";
import { weekDays } from "@/utils/constants";
import { Mic, Search, VideoCameraFront } from "@mui/icons-material";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { format } from 'date-fns';
import { useState } from "react";
import { useAuthStore } from "@/store/auth";

export default function Subject() {
  const param = useParams();

  const [search, setSearch] = useState('');
  const [ads, setAds] = useState<TAd[]>([]);


  const { data: subject, isFetching: loadingSubject } = useQuery<TSubjects>({
    queryKey: ['subject', param.id],
    queryFn: async () => {
      return await getSubject(param.id as string)
    },
    enabled: true,
    staleTime: 0,
  });

  const { data: subjectAds, isFetching: loadingSubjectAds } = useQuery<TAd[]>({
    queryKey: ['subjectAds', param.id],
    queryFn: async () => {
      const response = await getSubjectAds(param.id as string)
      setAds(response)
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

  return (
    <Layout>
      {loadingSubjectAds || loadingSubject && (
        <div className='flex justify-center w-full'>
          <CircularProgress color="success" />
        </div>
      )}
      {!loadingSubject && !loadingSubjectAds && (
        <div className='flex flex-col gap-4 justify-center p-8'>
          <Typography variant='h4' className='text-white text-center font-bold'>Encontre seu colega de estudo em <span className='text-green-500'>{subject?.name}</span></Typography>

          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-700 py-4 px-3 flex justify-between rounded-lg`}>
            <TextField
              variant="standard"
              color="success"
              placeholder="Digita a matéria"
              className="w-full border-none"
              sx={{input: {color: 'white'}}}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />            
            <div className={`self-center`}>
              <Search/>
            </div>
          </div>

          {filteredAds?.length === 0 && (
            <div className={`w-full mx-auto mt-4 bg-zinc-700 py-4 px-3 flex justify-between rounded-lg`}>
            <div className='flex flex-col'>
              <Typography variant='subtitle1' className='text-white font-bold'>Não encontrou o seu parceiro?</Typography>
              <Typography variant='subtitle2' className='text-zinc-400'>Publique um anúncio para encontrar novos estudantes</Typography>
            </div>
            
            <div className={`self-center`}>
              <Button variant='contained' color='error' size='small' className={`bg-red-500`} disabled={!Boolean(useAuthStore.getState().state.token)}>Publicar anúncio</Button>
            </div>
          </div>
          )}

          {filteredAds?.length > 0 && (
            <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-700 py-4 px-3 flex flex-col justify-between rounded-lg`}>
              {filteredAds?.map(ad => (
                <>
                  <div className="flex justify-between">
                    <div className={`flex flex-col gap-1`}>
                      <Typography variant='body1'className='font-bold text-green-500'>{ad.nameAd}</Typography>
                      <Typography variant='body1'>Nome: <b>{ad.detailUser.name}</b></Typography>
                      <Typography variant='body1'>Dias: <b>{weekDaysSelected(ad.detailAd.weekDay)}</b></Typography>
                      <Typography variant='body1'>Horário: <b>{format(ad.detailAd.hourStart, 'HH:mm')} - {format(ad.detailAd.hourEnd, 'HH:mm')}</b></Typography>
                      <div className="flex gap-1">
                        <Mic className={`${ad.detailAd.useVoice ? 'text-green-500' : 'text-gray-400'}`} />
                        <VideoCameraFront className={`${ad.detailAd.useVideo ? 'text-green-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                    <div className={`self-end`}>
                      <Button
                        variant='contained'
                        color='success'
                        size='small'
                        disabled={!Boolean(useAuthStore.getState().state.token)}
                      >
                        Conectar
                      </Button>
                    </div>
                  </div>
                  <Divisor />
                </>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}