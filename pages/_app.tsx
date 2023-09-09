import { useEffect, ReactElement, ReactNode } from 'react';

// Next
import { NextPage } from 'next';
import { Router } from 'next/router';
import type { AppProps } from 'next/app';

// Libraries
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { QueryClientProvider } from 'react-query';

import { queryClient } from '../libs/reactQuery';

import { store } from '../stores/store';

import GlobalStyle from '../components/globalstyles';

import useColorTheme from '../hooks/useColorTheme';

// Layout configuration doc
// https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#with-typescript

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
  router: Router // Error if this property doesn't exist
};

/**
 *
 *
 * @param {AppPropsWithLayout} { Component, pageProps }
 * @return {*} JSX.Element
 */
const WithThemeProviderComponent = ({ Component, pageProps }: AppPropsWithLayout) => {
  const { initColorTheme, getCurrentColorThemeStyle } = useColorTheme();

  useEffect(() => {
    initColorTheme();
  }, []);

  return (
    <ThemeProvider theme={getCurrentColorThemeStyle()}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

const App = ({ Component, pageProps, router }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {getLayout(
          <WithThemeProviderComponent
            Component={Component}
            pageProps={pageProps}
            router={router}
          />,
        )}
      </QueryClientProvider>
    </Provider>
  );
};
export default App;
