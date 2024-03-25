'use client'
import Image from 'next/image'
import Logo from '../../public/assets/images/logo.png'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'
import { Layout } from '@/components/layout'
import { Typography } from '@mui/material'


export default function Home() {
  const router = useRouter()
  const user = useUserStore.getState().state.user
  const auth = useAuthStore.getState().state.token

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
