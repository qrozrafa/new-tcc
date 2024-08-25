import { DetailAd } from "@/type/ads";
import { FilterList, FilterListOff, Search } from "@mui/icons-material";
import { Button, CircularProgress, Pagination, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "zustand";
import DeleteAd from "../DeleteAd/DeleteAd";
import { useContext, useState } from "react";
import ModalFormAd from "../ModalFormAd/ModalFormAd";
import { TSubjects } from "@/type/subject";
import { useSubjectsStore } from "@/store/subjects";
import { getAllAds } from "@/service/painel";
import { SnackbarContext } from "@/context/snackbar.context";
import { NotFoundAd } from "../NotFoundAd/NotFoundAd";
import { CardAd } from "../CardAd/CardAd";
import { FilterAd } from "../FilterAd/FilterAd";

export default function AllAds() {
  const snackbarContext = useContext(SnackbarContext);
  const subjectsStore = useStore(useSubjectsStore);

  const [search, setSearch] = useState<string>('');
  const [openModalDeleteAd, setOpenModalDeleteAd] = useState<boolean>(false);
  const [openModalEditAd, setOpenModalEditAd] = useState<boolean>(false);
  const [filterLastAds, setFilterLastAds] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<Number | any>(1);
  const [postsPerPage] = useState<Number | any>(6);
  const [adSelected, setAdSelected] = useState<DetailAd>();

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
          <FilterAd
            search={search}
            filterLastAds={filterLastAds}
            onSearch={setSearch}
            onFilteredDate={async (e) => {
              await setFilterLastAds(e);
              refetch();
            }}
          />
          
          {filteredAds?.length === 0 && (
            <NotFoundAd myAds/>
          )}

          {currentPosts?.length > 0 && (
          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex flex-col justify-between rounded-lg`}>

            <CardAd postAd={currentPosts} onDelete={handleDeleteAd} onEdit={handleEditAd} onClick={conectedAd}/>

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