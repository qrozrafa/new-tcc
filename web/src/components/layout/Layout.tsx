'use client'
import * as S from './styles';
import Nav from '../Nav/Nav';
import { Fragment } from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <Fragment>
      <Nav />
      <S.Container>
        {children}
      </S.Container>
    </Fragment>
  );
}