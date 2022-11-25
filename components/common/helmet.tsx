import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface IHelmetProps {
    title: string
}

export function Helmet (props: IHelmetProps) {
  const router = useRouter()
  return (
    <Head>
        <title>{router?.isReady ? props.title : 'Loading...'}</title>
    </Head>
  );
}