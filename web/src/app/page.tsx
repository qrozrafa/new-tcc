'use client'
import Image from 'next/image'
import Logo from '../../public/assets/images/logo.png'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user'
import { useAuthStore } from '@/store/auth'

export default function Home() {
  const router = useRouter()
  const user = useUserStore.getState().state.user
  const auth = useAuthStore.getState().state.token
  
  return (
    <>
      <div className='flex flex-col w-fit m-auto gap-8 mt-20'>
        <Image src={Logo} alt='logo duo study'/>
        <div className='flex flex-col gap-4 justify-center sm:flex-row'>
          {/* <Button.Root typeButton='optional'>Criar conta</Button.Root>
          <Button.Root typeButton='secondary' onClick={() => {router.push('/login')}}>Entrar</Button.Root> */}
        </div>
      </div>
    </>
  )
}
