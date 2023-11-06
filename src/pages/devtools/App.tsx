import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type FC } from 'react';

import { Page } from './Page';

export const App: FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
};
