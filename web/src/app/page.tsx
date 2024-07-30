'use client'
import Image from 'next/image'
import { getSubjects } from '@/service/subject'
import { ImageCard, TSubjects } from '@/type/subject'
import { CircularProgress, Typography } from '@mui/material'
// @ts-ignore
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import { useQuery } from '@tanstack/react-query'

import useScreenSize from '@/utils/resize'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout'
import { NotFoundAd } from '@/components/NotFoundAd/NotFoundAd'
import { useEffect } from 'react'
import { useSubjectsStore } from '@/store/subjects'

import notImg from '../../public/assets/images/No Image.png';

export default function Home() {
  const router = useRouter();
  const isMobile = useScreenSize(688);
  const useSubjects = useSubjectsStore();

  const { data: subjects, isFetching: loadingSubjects } = useQuery<TSubjects[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      return await getSubjects()
    },
  });

  useEffect(() => {
    useSubjects.setSubjects(subjects || []);
  }, [loadingSubjects === false])

  return (
    <>
      <Layout>
        <div className='flex flex-col gap-4 justify-center p-8'>
          {loadingSubjects && (
            <div className='flex justify-center w-full'>
              <CircularProgress color="success" />
            </div>
          )}
          {subjects && subjects.length > 0 && (
            <>
              <Typography variant='h2' className='text-zinc-700 text-center font-bold'>Encontre seu <span className='text-red-600 font-bold'>grupo</span> de <span className='text-green-500 font-bold'>estudo</span></Typography>
              <div className='max-w-7xl w-auto'>
                <Splide  
                  options={{
                    width: window.innerWidth - 85,
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
                {subjects.map((subject, index) => (    
                  <SplideSlide key={index} id={`splide-slide${index}`}>
                    <div className='flex flex-col justify-between py-4 w-[180px] h-[240px] bg-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-100 hover:drop-shadow-lg' onClick={() => router.push(`/subject/${subject.id}`)}>
                      <Image alt='' src={subject.image ? `${process.env.NEXT_PUBLIC_BASE_URL}/storage/subject/${subject.image}` : notImg} width={96} height={96} className='self-center py-4'/>
                      <div className='align-bottom'>
                        <Typography variant='subtitle1' textAlign='start' justifySelf={'end'} className='text-green-500 px-2' fontWeight={'bold'}>{subject.name}</Typography>
                        <Typography variant='subtitle2' textAlign='start' justifySelf={'end'} className='text-zinc-400 px-2'>{subject.countAds > 1 ? `${subject.countAds} anúncios` : `${subject.countAds} anúncio`}</Typography>
                      </div>
                    </div>
                  </SplideSlide>
                ))}
                </Splide>
              </div>
              <NotFoundAd
                subjects={subjects}
              />
            </>
          )}
        </div>
      </Layout>
    </>
  )
}