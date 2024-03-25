import { useAuthStore } from "@/store/auth";
import useScreenSize from "@/utils/resize";
import { Button, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import ModalFormAd from "../ModalFormAd/ModalFormAd";

export function NotFoundAd() {
  const isMobile = useScreenSize(688);
  const [openModal, setOpenModal] = useState(false);

  return (
    <Fragment>
      <div className={`w-[calc(100%-60px)] mx-auto mt-4 bg-zinc-300 py-4 px-3 drop-shadow-lg flex ${isMobile && 'flex-col'} justify-between rounded-lg`}>
        <div className='flex flex-col'>
          <Typography variant='h6' className='text-green-500 font-bold'>Não encontrou o seu parceiro?</Typography>
          <Typography variant='subtitle2' className='text-zinc-400'>Publique um anúncio para encontrar novos estudantes</Typography>
        </div>
        
        <div className={`self-center ${isMobile && 'w-full mt-2' }}`}>
          <Button
            variant='contained'
            color='error'
            size='small'
            className={`bg-red-500 ${isMobile && 'w-full mt-2'}}`}
            disabled={!Boolean(useAuthStore.getState().state.token)}
            onClick={() => setOpenModal(true)}
          >
            Publicar anúncio
          </Button>
        </div>
      </div>

      <ModalFormAd
        open={openModal}
        handleClose={() => setOpenModal(false)}
      />
    </Fragment>
  )
}