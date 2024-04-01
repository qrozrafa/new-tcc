import { getAdsByUser } from "@/service/profile";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { Divisor } from "@/styles/styles";
import { DetailAd, TAd } from "@/type/ads";
import { weekDays } from "@/utils/constants";
import { Delete, Edit, Mic, Task, VideoCameraFront } from "@mui/icons-material";
import { Button, CircularProgress, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useStore } from "zustand";

export default function MyAds() {
  const useAuth = useStore(useAuthStore);
  const useUser = useStore(useUserStore);
  const { user } = useUser;
  const { authenticated } = useAuth;


  const {data: dataSubjectAds, isFetching: loadingSubjectAds } = useQuery<DetailAd[]>({
    queryKey: ['subjectAds', user?.id],
    queryFn: async () => {
      return await getAdsByUser(user?.id as string)
    },
    enabled: !!user?.id,
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
                    <Typography variant='body1'className='font-bold text-green-500'><b>{ad.name}</b></Typography>
                    <Typography variant='body1'className="text-zinc-700">Dias: <b>{weekDaysSelected(ad.weekDay)}</b></Typography>
                    <Typography variant='body1' className="text-zinc-700">Horário: <b>{format(ad.hourStart, 'HH:mm')} - {format(ad.hourEnd, 'HH:mm')}</b></Typography>
                    <div className="flex gap-1">  
                      <Tooltip title={ad.useVoice ? "Microfone disponível" : "Microfone indisponível"}>
                        <Mic className={`${ad.useVoice ? 'text-green-500' : 'text-gray-700'}`} />
                      </Tooltip>
                      <Tooltip title={ad.useVideo ? "Video disponível" : "Video indisponível"}>
                        <VideoCameraFront className={`${ad.useVideo ? 'text-green-500' : 'text-gray-300'}`} />
                      </Tooltip>
                    </div>
                  </div>
                  <div className={`flex gap-2 self-start`}>
                    <Tooltip title="Editar anúncio">
                      <Edit color="success"/>
                    </Tooltip>
                    <Tooltip title="Excluir anúncio">
                      <Delete color="error"/>
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
    </>
  )
}