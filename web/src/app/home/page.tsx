'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Logo from '../../../public/assets/images/logo.png'
import { getSubjects } from '@/service/subject'
import { ImageCard, TSubjects } from '@/type/subject'
import { Button, Card, CircularProgress, Typography } from '@mui/material'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css';
import { useQuery } from '@tanstack/react-query'

// IMAGE
import adm from '../../../public/assets/images/subjects/Administração.png';
import fsc from '../../../public/assets/images/subjects/Física.png';
import mat from '../../../public/assets/images/subjects/Matemática.png';
import lin from '../../../public/assets/images/subjects/Linguagens.png';
import soc from '../../../public/assets/images/subjects/Sociologia.png';
import eng from '../../../public/assets/images/subjects/Engenharia.png';
import edf from '../../../public/assets/images/subjects/Ed. Física.png';
import inf from '../../../public/assets/images/subjects/Informática.png';
import geo from '../../../public/assets/images/subjects/Geografia.png';
import bio from '../../../public/assets/images/subjects/Biologia.png';
import qui from '../../../public/assets/images/subjects/Química.png';
import his from '../../../public/assets/images/subjects/História.png';


import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import useScreenSize from '@/utils/resize'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout'
import { useAuthStore } from '@/store/auth'

export default function Home() {
  const router = useRouter()
  const isMobile = useScreenSize(688)

  const { data: subjects, isFetching: loadingSubjects } = useQuery<TSubjects[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      return await getSubjects()
    },
  });

  const imageMap: Record<ImageCard, StaticImport> = {
    'Administração': adm,
    'Física': fsc,
    'Matemática': mat,
    'Linguagens': lin,
    'Sociologia': soc,
    'Engenharia': eng,
    'Ed. Física': edf,
    'Informática': inf,
    'Geografia': geo,
    'Biologia': bio,
    'Química': qui,
    'História': his,
  };

  function setImageCard(image: ImageCard): StaticImport | string {
    return imageMap[image] || image;
  }

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
              <Typography variant='h2' className='text-white text-center font-bold'>Encontre seu <span className='text-red-600'>colega</span> de <span className='text-green-500'>estudo</span></Typography>
              <div className='w-full'>
                <Splide  
                  options={{
                    width: window.innerWidth - 85,
                    fixedWidth: '180px',
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
                    <div className='flex flex-col justify-between py-4 w-[180px] h-[240px] bg-zinc-700 rounded-lg cursor-pointer' onClick={() => router.push(`/subject/${subject.id}`)}>
                      <Image alt='' src={setImageCard(subject.name as ImageCard)} width={96} height={96} className='self-center py-4'/>
                      <div className='align-bottom'>
                        <Typography variant='subtitle1' textAlign='start' justifySelf={'end'} className='text-white px-2' fontWeight={'bold'}>{subject.name}</Typography>
                        <Typography variant='subtitle2' textAlign='start' justifySelf={'end'} className='text-zinc-400 px-2'>{subject.countAds > 1 ? `${subject.countAds} anúncios` : `${subject.countAds} anúncio`}</Typography>
                      </div>
                    </div>
                  </SplideSlide>
                ))}
                </Splide>
              </div>
              <div className={`w-[calc(100%-60px)] mx-auto mt-4 bg-zinc-700 py-4 px-3 flex ${isMobile && 'flex-col'} justify-between rounded-lg`}>
                <div className='flex flex-col'>
                  <Typography variant='subtitle1' className='text-white font-bold'>Não encontrou o seu parceiro?</Typography>
                  <Typography variant='subtitle2' className='text-zinc-400'>Publique um anúncio para encontrar novos estudantes</Typography>
                </div>
                
                <div className={`self-center ${isMobile && 'w-full mt-2' }}`}>
                  <Button variant='contained' color='error' size='small' className={`bg-red-500 ${isMobile && 'w-full mt-2'}}`} disabled={!Boolean(useAuthStore.getState().state.token)}>Publicar anúncio</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Layout>
    </>
  )
}