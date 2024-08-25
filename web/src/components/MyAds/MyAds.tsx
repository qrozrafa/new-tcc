import { getAdsByUser } from "@/service/profile";
import { useUserStore } from "@/store/user";
import { Divisor } from "@/styles/styles";
import { DetailAd } from "@/type/ads";
import { Delete, Edit, Mic, VideoCameraFront } from "@mui/icons-material";
import { CircularProgress, IconButton, Pagination, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useStore } from "zustand";
import DeleteAd from "../DeleteAd/DeleteAd";
import { useState } from "react";
import { weekDaysSelected } from "@/utils/utils";
import ModalFormAd from "../ModalFormAd/ModalFormAd";
import { TSubjects } from "@/type/subject";
import { useSubjectsStore } from "@/store/subjects";
import { NotFoundAd } from "../NotFoundAd/NotFoundAd";
import { CardAd } from "../CardAd/CardAd";
import { FilterAd } from "../FilterAd/FilterAd";

export default function MyAds() {
  const useUser = useStore(useUserStore);
  const subjectsStore = useStore(useSubjectsStore);

  const [search, setSearch] = useState<string>('');
  const [openModalDeleteAd, setOpenModalDeleteAd] = useState<boolean>(false);
  const [openModalEditAd, setOpenModalEditAd] = useState<boolean>(false);
  const [filterLastAds, setFilterLastAds] = useState<boolean>(false);
  const [adSelected, setAdSelected] = useState<DetailAd>();
  const [currentPage, setCurrentPage] = useState<Number | any>(1);
  const [postsPerPage] = useState<Number | any>(6);
  const { user } = useUser;
  const { subjects } = subjectsStore;


  const {data: dataSubjectAds, isFetching: loadingSubjectAds, refetch } = useQuery<DetailAd[]>({
    queryKey: ['subjectAds', user?.id],
    queryFn: async () => {
      return await getAdsByUser(user?.id as string, filterLastAds);
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

  const filteredAds = dataSubjectAds?.filter(ad => {
    return ad.nameAd.toLowerCase().includes(search.toLowerCase());
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
      {!loadingSubjectAds && filteredAds && currentPosts && (
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
          {currentPosts?.length > 0 ? (
          <div className={`w-full mx-auto mt-4 gap-4 bg-zinc-200 py-4 px-3 flex flex-col justify-between rounded-lg`}>
            <CardAd postAd={currentPosts} onDelete={handleDeleteAd} onEdit={handleEditAd} onClick={() => {}}/>

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
        ) : (
          <NotFoundAd myAds />
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