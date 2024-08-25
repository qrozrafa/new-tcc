"use client"
import useScreenSize from '@/utils/resize';
// @ts-ignore
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import { useRouter } from 'next/navigation';

import notImg from '../../../public/assets/images/No Image.png';
import { TSubjects } from '@/type/subject';
import Image from 'next/image';
import { CircularProgress, Typography } from '@mui/material';

import { useSubjectsStore } from '@/store/subjects'

import { useQuery } from '@tanstack/react-query'
import { getSubjects } from '@/service/subject';
import { useEffect } from 'react';

export function CarrouselSubject() {
  const useSubjects = useSubjectsStore();
  const router = useRouter();
  const isMobile = useScreenSize(688);

  const { data: subjects, isFetching: loadingSubjects } = useQuery<TSubjects[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      return await getSubjects();
    },
  });

  useEffect(() => {
    useSubjects.setSubjects(subjects || []);
  }, [loadingSubjects === false])

  return (
    <>
      {loadingSubjects && (
        <div className='flex justify-center w-full'>
          <CircularProgress color="success" />
        </div>
      )}
      {subjects?.length === 0 && (
        <Typography variant='h6' className='text-green-500 font-bold'>Nenhuma matéria encontrada</Typography>
      )}
      {subjects && subjects?.length > 0 && !loadingSubjects && (
        <div className='max-w-7xl w-auto'>
          <Splide  
            options={{
              width: (window.innerWidth - 85),
              fixedWidth: '180px',
              height: '250px',
              gap: '16px',
              perPage: isMobile ? 1 : 7.30,
              perMove: 4,
              focus: 'center',
              start: 1,
              pagination: false,
              arrows: false,
            }}
            id="splide"
            aria-label="React Splide Example"
          >
          {subjects?.map((subject, index) => (    
            <SplideSlide key={index} id={`splide-slide${index}`}>
              <div
                className='
                  flex
                  flex-col
                  justify-between
                  py-4
                  w-[180px]
                  h-[240px]
                  bg-zinc-200
                  rounded-lg
                  cursor-pointer
                  hover:bg-zinc-100
                  hover:drop-shadow-lg
                '
                onClick={() => router.push(`/subject/${subject.id}`)}
              >
                <Image
                  alt=''
                  src={subject.image ? `${process.env.NEXT_PUBLIC_BASE_URL}/storage/subject/${subject.image}` : notImg}
                  width={96}
                  height={96}
                  className='self-center py-4'
                />
                <div className='align-bottom'>
                  <Typography
                    variant='subtitle1'
                    textAlign='start'
                    justifySelf={'end'}
                    className='text-green-500 px-2'
                    fontWeight={'bold'}
                  >
                    {subject.name}
                  </Typography>
                  <Typography
                    variant='subtitle2'
                    textAlign='start'
                    justifySelf={'end'}
                    className='text-zinc-400 px-2'
                  >
                    {subject.countAds > 1 ? `${subject.countAds} anúncios` : `${subject.countAds} anúncio`}
                  </Typography>
                </div>
              </div>
            </SplideSlide>
          ))}
          </Splide>
        </div>
      )}
    </>
  )
}