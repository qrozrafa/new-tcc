'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Layout } from '@/components/layout'
import { Typography } from '@mui/material'


export default function Home() {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push('/home')
    }, 1000)
  }, []);
  
  return (
    <>
      <Layout>
        <Typography variant='h1' className='text-zinc-700'>Bem-vindo</Typography>
      </Layout>
    </>
  )
}
