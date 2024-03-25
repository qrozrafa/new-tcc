import Image from 'next/image';
import * as S from './styles';
import Logo from '../../../public/assets/images/logo.png';
import { useRouter } from 'next/navigation';
import Nav from '../Nav/Nav';
import { Fragment } from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const isPublicRoute = ['/', '/login', '/register', '/forgot-password'].includes(window.location.pathname)
  return (
    <Fragment>
      {!isPublicRoute && (
        <Nav />
      )}
      <S.Container>
        <Image src={Logo} alt='logo duo study' onClick={() => router.push('/home')} className='cursor-pointer'/>
        {children}
      </S.Container>
    </Fragment>
  );
}