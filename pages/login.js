import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from 'styles/Login.module.css';
import { useRouter } from 'next/router';
import { magic } from 'lib/magic-client';

const Login = () => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (email.includes('@') && email.length > 5) {
      if (email === 'homejr@protonmail.com') {
        try {
          setLoading(true);
          const didToken = await magic.auth.loginWithMagicLink({ email });
          if (didToken) {
            router.push('/');
          }
        } catch (err) {
          console.error('Error while login', err);
          setLoading(false);
        }
      } else {
        setError('Email does not exists!');
      }
    } else {
      setError('Please enter a valid email!');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Sign In</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix Logo"
                width={'128'}
                height={'34px'}
              />
            </div>
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            className={styles.emailInput}
            type="text"
            placeholder="Email address"
            onChange={(e) => {
              setError('');
              setEmail(e.target.value);
            }}
          />
          {error && <p className={styles.userMsg}>{error}</p>}
          <button className={styles.loginBtn} onClick={handleSignIn}>
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
