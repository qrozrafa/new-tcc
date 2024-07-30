import { useAuthStore } from "@/store/auth";
import useScreenSize from "@/utils/resize";
import { Button, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import ModalFormAd from "../ModalFormAd/ModalFormAd";
import { useStore } from "zustand";
import { TSubjects } from "@/type/subject";

export function NotFoundAd({ subjects, subjectId, myAds }: {subjects: TSubjects[], subjectId?: string, myAds?: boolean}) {
  const isMobile = useScreenSize(688);
  const [openModal, setOpenModal] = useState(false);
  const authStore = useStore(useAuthStore);
  const { authenticated } = authStore;

  return (
    <Fragment>
      <div className={`w-full mx-auto mt-4 bg-zinc-200 py-4 px-3 flex ${isMobile && 'flex-col'} justify-between rounded-lg`}>
        <div className='flex flex-col'>
          <Typography variant='h6' className='text-green-500 font-bold'>{myAds ? 'Nenhum anúncio publicado' : 'Não encontrou o seu grupo?'}</Typography>
          <Typography variant='subtitle2' className='text-zinc-400'>Publique um anúncio para encontrar novos estudantes</Typography>
        </div>
        
        <div className={`self-center ${isMobile && 'w-full mt-2' }}`}>
          <Button
            variant='contained'
            color='error'
            size='small'
            className={`bg-red-500 ${isMobile && 'w-full mt-2'}}`}
            disabled={!authenticated}
            onClick={() => setOpenModal(true)}
          >
            Publicar anúncio
          </Button>
        </div>
      </div>

      <ModalFormAd
        open={openModal}
        handleClose={() => {setOpenModal(false)}}
        subjects={subjects}
        subjectId={subjectId}
      />
    </Fragment>
  )
}