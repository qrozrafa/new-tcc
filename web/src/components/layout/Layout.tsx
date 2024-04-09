'use client'
import * as S from './styles';
import Nav from '../Nav/Nav';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const isPublicRoute = ['/'].includes(pathname)
  return (
    <Fragment>
      {!isPublicRoute && (
        <Nav />
      )}
      <S.Container>
        {children}
      </S.Container>
    </Fragment>
  );
}