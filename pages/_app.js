import { useEffect, useState } from 'react';
import '../styles/globals.css';
import { magic } from 'lib/magic-client';
import { useRouter } from 'next/router';
import Loading from 'components/loading/loading';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loginCheck = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        router.push('/');
      } else {
        router.push('/login');
      }
    };
    loginCheck();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  return <Component {...pageProps} />;
}

export default MyApp;
