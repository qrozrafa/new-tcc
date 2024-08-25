import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { Divisor } from "@/styles/styles";
import { DetailAd } from "@/type/ads";
import { weekDays } from "@/utils/constants";
import { Delete, Edit, Mic, VideoCameraFront } from "@mui/icons-material";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";
import { Fragment } from "react";
import { useStore } from "zustand";
type CardAdProps = {
  postAd: DetailAd[],
  onEdit: (ad: DetailAd) => void,
  onDelete: (ad: DetailAd) => void,
  onClick: (link: string) => void,
}
export function CardAd({ postAd, onEdit, onDelete, onClick }: CardAdProps) {
  const authStore = useStore(useAuthStore);
  const userStore = useStore(useUserStore);
  const { authenticated } = authStore;
  const { user } = userStore;

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
    <Fragment>
      {postAd?.map(ad => (
        <Fragment key={ad.id}>
          <div className="flex justify-between">
            <div className={`flex flex-col gap-1`}>
              <Typography variant='body1'className='font-bold text-green-500'><b>{ad.name}</b></Typography>
              {ad.nameUser && <Typography variant='body1' className="text-zinc-700">Criado por: <b>{ad.nameUser}</b></Typography>}
              <Typography variant='body1'className="text-zinc-700">Dias: <b>{weekDaysSelected(ad.weekDay)}</b></Typography>
              <Typography variant='body1' className="text-zinc-700">Horário: <b>{format(ad.hourStart, 'HH:mm')} - {format(ad.hourEnd, 'HH:mm')}</b></Typography>
              <Typography variant='body1' className="text-zinc-700">Criado em: <b>{format(ad.createdAt, 'dd/MM/yyyy')}</b></Typography>
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
                    <IconButton color="success" onClick={() => onEdit(ad)}>
                      <Edit color="success"/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir anúncio">
                    <IconButton color="error" onClick={() => onDelete(ad)}>
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
                    onClick={() => onClick(ad.linkCall)}
                  >
                    Copiar link
                  </Button>
                )}
              </div>
            </div>
          </div>
          <Divisor />
        </Fragment>
      ))}
    </Fragment>
  );
}