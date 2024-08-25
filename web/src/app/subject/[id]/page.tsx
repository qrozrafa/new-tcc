'use client'
import { Layout } from "@/components/layout";
import { getSubject, getSubjectAds } from "@/service/subject";
import { DetailAd } from "@/type/ads";
import { TSubjects } from "@/type/subject";
import { FilterList, FilterListOff, Search } from "@mui/icons-material";
import { Button, CircularProgress, Pagination, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import { NotFoundAd } from "@/components/NotFoundAd/NotFoundAd";
import { useStore } from "zustand";
import DeleteAd from "@/components/DeleteAd/DeleteAd";
import ModalFormAd from "@/components/Modais/ModalFormAd/ModalFormAd";
import { useSubjectsStore } from "@/store/subjects";
import { SnackbarContext } from "@/context/snackbar.context";
import { CardAd } from "@/components/CardAd/CardAd";
import { FilterAd } from "@/components/FilterAd/FilterAd";

export default function Subject() {
  const param = useParams();
  const snackbarContext = useContext(SnackbarContext);

  const subjectsStore = useStore(useSubjectsStore);

  const [search, setSearch] = useState('');
  const [ads, setAds] = useState<DetailAd[]>([]);
  const [openModalDeleteAd, setOpenModalDeleteAd] = useState<boolean>(false);
  const [openModalEditAd, setOpenModalEditAd] = useState<boolean>(false);
  const [filterLastAds, setFilterLastAds] = useState<boolean>(false);
  const [adSelected, setAdSelected] = useState<DetailAd>();
  const [currentPage, setCurrentPage] = useState<Number | any>(1);
  const [postsPerPage] = useState<Number | any>(6);

  const { subjects } = subjectsStore;


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
      const resp =  await getSubjectAds(param.id as string, filterLastAds);
      await setAds(resp)
      return []
    },
    enabled: true,
    staleTime: 0,
  });
    
  const filteredAds = ads?.filter(ad => {
    const foundAd = ad.nameAd.toLowerCase().includes(search.toLowerCase());
    const foundCreator = ad.nameUser.toLowerCase().includes(search.toLowerCase());
    
    if (foundAd) {
      return foundAd;
    } else if (foundCreator) {
      return foundCreator;
    }
  })
  
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

  function paginate(pageNumber: any): void {
    return setCurrentPage(pageNumber);
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredAds.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <Layout>
      {loadingSubjectAds || loadingSubject && (
        <div className='flex justify-center w-full'>
          <CircularProgress color="success" />
        </div>
      )}
      {!loadingSubject && !loadingSubjectAds && (
        <div className='flex flex-col gap-4 justify-center p-8'>
          <Typography variant='h4' className='text-zinc-700 text-center font-bold'>Encontre seu grupo de estudo em <span className='text-green-500 font-bold'>{subject?.name}</span></Typography>

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
            <NotFoundAd subjectId={param.id as string}/>
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
                    hideNextButton={true}
                    hidePrevButton={true}
                    onChange={(e, value) => paginate(value)}
                  />
                </div>
              )}
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