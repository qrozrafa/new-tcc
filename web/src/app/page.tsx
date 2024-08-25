import { Typography } from '@mui/material'

import { Layout } from '@/components/layout'
import { NotFoundAd } from '@/components/NotFoundAd/NotFoundAd'
import { Fragment } from 'react'
import { CarrouselSubject } from '@/components/CarrouselSubject/CarrouselSubject'


export default async function Home() {

  return (
    <Layout>
      <div className='flex flex-col gap-4 justify-center p-8'>
        
        <Fragment>
          <Typography
            variant='h2'
            className='text-zinc-700 text-center font-bold'
          >
            Encontre seu <span className='text-red-600 font-bold'>grupo</span> de <span className='text-green-500 font-bold'>estudo</span>
          </Typography>
          <CarrouselSubject />
          <NotFoundAd />
        </Fragment>

      </div>
    </Layout>
  )
}