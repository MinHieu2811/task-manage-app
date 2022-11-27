import { db } from 'config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { Props, ScriptProps } from 'next/script';
import * as React from 'react';

export interface IAppProps {
}

export default function App (props: IAppProps) {
  return (
    <div>
      
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props, {id: string} > = async (context): Promise<GetServerSidePropsResult<Props>> => {
    const boardId = context?.params?.id
    const docRef = doc(db, 'boards', boardId as string)
    const docSnap = await getDoc(docRef)
    return {
        props: {
            children: {
                
            }
        }
    }
}