import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';
import { useEffect } from 'react';
import { magic } from 'lib/magic-client';

const Navbar = (props) => {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const getMetaData = async () => {
      try {
        const { email } = await magic.user.getMetadata();
        if (email) setUsername(email);
      } catch (err) {
        console.log('error while getting userdata', err);
      }
    };
    getMetaData();
  }, []);

  const handleOnClickHome = (event) => {
    event.preventDefault();
    router.push('/');
  };

  const handleSignOut = async (event) => {
    try {
      await magic.user.logout();
    } catch (err) {
      console.log('error while logout', err);
    }
    router.push('/login');
  };

  const handleOnClickMyList = (event) => {
    event.preventDefault();
    router.push('/browse/mylist');
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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

        <ul className={styles.navItems}>
          <li onClick={handleOnClickHome} className={styles.navItem}>
            Home
          </li>
          <li onClick={handleOnClickMyList} className={styles.navItem}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button
              onClick={() => {
                setShowDropdown((currentState) => !currentState);
              }}
              className={styles.usernameBtn}
            >
              <p className={styles.username}>{username}</p>
              <Image
                src="/static/expand_more.svg"
                alt=""
                width="24px"
                height="24px"
              />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <a onClick={handleSignOut} className={styles.linkName}>
                  Sign out
                </a>
                <div className={styles.lineWrapper}></div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
