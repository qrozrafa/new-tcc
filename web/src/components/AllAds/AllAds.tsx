import { useUserStore } from "@/store/user";
import { Divisor } from "@/styles/styles";
import { DetailAd } from "@/type/ads";
import { Delete, Edit, FilterList, FilterListOff, Mic, Search, VideoCameraFront } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Pagination, TextField, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useStore } from "zustand";
import DeleteAd from "../DeleteAd/DeleteAd";
import { useContext, useState } from "react";
import { weekDaysSelected } from "@/utils/utils";
import ModalFormAd from "../ModalFormAd/ModalFormAd";
import { TSubjects } from "@/type/subject";
import { useSubjectsStore } from "@/store/subjects";
import { getAllAds } from "@/service/painel";
import { useAuthStore } from "@/store/auth";
import { SnackbarContext } from "@/context/snackbar.context";
import { NotFoundAd } from "../NotFoundAd/NotFoundAd";

export default function AllAds() {
  const snackbarContext = useContext(SnackbarContext);
  const useUser = useStore(useUserStore);
  const authStore = useStore(useAuthStore);
  const subjectsStore = useStore(useSubjectsStore);

  const [search, setSearch] = useState<string>('');
  const [openModalDeleteAd, setOpenModalDeleteAd] = useState<boolean>(false);
  const [openModalEditAd, setOpenModalEditAd] = useState<boolean>(false);
  const [filterLastAds, setFilterLastAds] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<Number | any>(1);
  const [postsPerPage] = useState<Number | any>(6);
  const [adSelected, setAdSelected] = useState<DetailAd>();

  const { authenticated } = authStore;
  const { user } = useUser;
  const { subjects } = subjectsStore;


  const {data: dataSubjectAds, isFetching: loadingSubjectAds, refetch } = useQuery<DetailAd[]>({
    queryKey: ['allAds'],
    queryFn: async () => {
      return await getAllAds(filterLastAds)
    },
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

  function conectedAd(link: string) {
    if (!link) return

    navigator.clipboard.writeText(link);
    snackbarContext.success('Link para o encontro copiado!');
  }

  const filteredAds = dataSubjectAds?.filter(ad => {
    const foundAd = ad.nameAd.toLowerCase().includes(search.toLowerCase());
    const foundCreator = ad.nameUser.toLowerCase().includes(search.toLowerCase());
    
    if (foundAd) {
      return foundAd;
    } else if (foundCreator) {
      return foundCreator;
    }
  })

  function paginate(pageNumber: any): void {
    return setCurrentPage(pageNumber);
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredAds?.slice(indexOfFirstPost, indexOfLastPost);


  return (
    <>
      {loadingSubjectAds  && (
        <div className='flex justify-center w-full'>
          <CircularProgress color="success" />
        </div>
      )}
      {!loadingSubjectAds && currentPosts && filteredAds && (
        <>
          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex justify-between rounded-lg`}>
            <TextField
              variant="standard"
              color="success"
              placeholder="Digita a matéria ou criador"
              className="w-full border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />            
            <div className={`self-center`}>
              <Search color="success"/>
            </div>
          </div>

          <div className="flex self-end items-center">
            <Button
              variant="text"
              color="success"
              onClick={
                async () => {
                  await setFilterLastAds(!filterLastAds);
                  refetch()
                  }
                }
              >
              <Typography variant="body1" className="text-zinc-400">{filterLastAds ? 'Mais recente' : 'Mais antigo'}</Typography>
              {filterLastAds ? <FilterListOff color="disabled"/> : <FilterList color="disabled"/>}
            </Button>                
          </div>
          
          {filteredAds?.length === 0 && (
            <NotFoundAd subjects={subjects} myAds/>
          )}

          {currentPosts?.length > 0 && (
          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex flex-col justify-between rounded-lg`}>

            {currentPosts?.map(ad => (
              <>
                <div className="flex justify-between">
                  <div className={`flex flex-col gap-1`}>
                    <Typography variant='body1'className='font-bold text-green-500'><b>{ad?.name}</b></Typography>
                    <Typography variant='body1' className="text-zinc-700">Criado por: <b>{ad.nameUser}</b></Typography>
                    <Typography variant='body1'className="text-zinc-700">Dias: <b>{weekDaysSelected(ad?.weekDay)}</b></Typography>
                    <Typography variant='body1' className="text-zinc-700">Horário: <b>{format(ad?.hourStart, 'HH:mm')} - {format(ad?.hourEnd, 'HH:mm')}</b></Typography>
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
                            <IconButton color="success" onClick={() => handleEditAd(ad)} disabled={!authenticated}>
                              <Edit color="success"/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir anúncio">
                            <IconButton color="error"  onClick={() => handleDeleteAd(ad)} disabled={!authenticated}>
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
                            onClick={() => conectedAd(ad.linkCall)}
                          >
                            Copiar link
                          </Button>
                        )}
                      </div>
                    </div>
                </div>
                <Divisor />
              </>
            ))}
            {filteredAds?.length > postsPerPage && (
              <div className={`w-full mx-auto mt-4 flex justify-center `}>
                <Pagination 
                  count={Math.ceil(filteredAds.length / postsPerPage)}
                  color="standard"
                  variant="outlined"
                  shape="rounded"
                  // showFirstButton={true}
                  // showLastButton={true}
                  hideNextButton={true}
                  hidePrevButton={true}
                  onChange={(e, value) => paginate(value)}
                />
              </div>
            )}
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