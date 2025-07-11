'use client';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import dynamic from 'next/dynamic';
import type React from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './query-provider';
// import "../styles/index.scss";

dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);

dayjs.updateLocale('en', {
  relativeTime: {
    past: (input: unknown) => (input === 'just now' ? input : input + ' ago'),
    s: 'just now',
    future: 'in %s',
    ss: '%d seconds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1M',
    MM: '%dM',
    y: '1y',
    yy: '%dy',
  },
});

// Dynamically import AppKitProvider to avoid SSR issues
const AppKitProvider = dynamic(
  () => import('./appkit-provider').then((mod) => ({ default: mod.AppKitProvider })),
  {
    ssr: false,
  }
);

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppKitProvider>
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    </AppKitProvider>
  );
};

export default Provider;
