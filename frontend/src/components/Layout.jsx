import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { getProfile } from '../api.js';

export default function Layout() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((err) => console.error('Failed to load profile', err));
  }, []);

  return (
    <>
      <Navbar profile={profile} />
      <Outlet context={{ profile }} />
      <Footer profile={profile} />
    </>
  );
}
