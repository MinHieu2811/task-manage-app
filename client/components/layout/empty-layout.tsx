import * as React from 'react';
import { LayoutProps } from '@/models/index';

export function EmptyLayout ({ children}: LayoutProps) {
  return (
    <>
      {children}
    </>
  );
}