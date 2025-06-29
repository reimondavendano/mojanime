'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { ReactNode } from 'react';

interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * ReduxProvider component to wrap the Next.js application with the Redux store.
 * This makes the Redux store available to all components within the application.
 */
export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}