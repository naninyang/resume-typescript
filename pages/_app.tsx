import { Lato } from 'next/font/google'
import Head from 'next/head'
import styled from '@emotion/styled';
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.sass'
import { AuthProvider } from '@/components/hooks/authContext'
import { checkToken } from '@/components/hooks/checkToken'
import { Rem, hex, rgba } from '@/styles/designSystem';
import { useEffect } from 'react';
import { ManagementPage } from '@/styles/manageSystem';
import Navigation from './manages/navigation';
import { ServicePage } from '@/styles/serviceSystem';

const lato = Lato({
  weight: ['100', '400', '700', '900'],
  subsets: ['latin'],
})

const ToastProvider = styled.div({
  '& .Toastify': {
    '& .Toastify__toast-container': {
      minWidth: Rem(320),
      width: 'auto',
      minHeight: Rem(78),
      '& .Toastify__toast--success': {
        backgroundColor: hex.light,
      },
      '& .Toastify__toast--error': {
        backgroundColor: hex.danger,
      },
      '& .Toastify__toast': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: `${Rem(10)} ${Rem(15)}`,
        textAlign: 'center',
        borderRadius: Rem(10),
        '& .Toastify__toast-body': {
          margin: 0,
          padding: 0,
          position: 'relative',
          zIndex: 99999,
          '& div': {
            fontSize: Rem(16),
            fontWeight: '700',
            lineHeight: '1.625',
            color: hex.dark,
          },
        },
        '& .Toastify__progress-bar': {
          height: '100%',
          backgroundColor: `rgba(${rgba.mint50})`,
        },
      },
    },
  },
})

type AppProps = {
  Component: React.ComponentType;
  pageProps: any;
};

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('webfontloader').then(WebFont => {
        WebFont.load({
          google: {
            families: ['Noto Sans KR:100,400,700,900']
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    const tokenCheckInterval = setInterval(checkToken, 10000);
    return () => clearInterval(tokenCheckInterval);
  }, []);

  const router = useRouter();
  const isManagementPage = router.pathname.includes("/manages");
  const isServicePage = !isManagementPage;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <AuthProvider>
        {isManagementPage && (
          <>
            <style jsx global>{`
            body, pre, input, button, textarea, select, legend {
              font-family: ${lato.style.fontFamily}, 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Nanum Gothic', 'Malgun Gothic', sans-serif
            }
          `}</style>
            <ManagementPage>
              <Navigation />
              <Component
                {...pageProps}
              />
            </ManagementPage>
          </>
        )}
        {isServicePage && (
          <>
            <style jsx global>{`
            body, pre, input, button, textarea, select, legend {
              font-family: ${lato.style.fontFamily}, 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Nanum Gothic', 'Malgun Gothic', sans-serif
            }
          `}</style>
            <ServicePage>
              <Component
                {...pageProps}
              />
            </ServicePage>
          </>
        )}
        <ToastProvider>
          <ToastContainer
            icon={false}
            closeButton={false}
          />
        </ToastProvider>
      </AuthProvider>
    </>
  )
}
