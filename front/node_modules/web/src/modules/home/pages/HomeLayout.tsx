import React from 'react';
import { Outlet } from 'react-router-dom';
import Header  from '../components/Header/Header';
import Footer  from '../components/Footer/Footer';
import Scripts from '../components/SEO/Scripts';
import { nav, mega } from '../services/homeNav';
import type { SeoMeta } from '../types/home.types';
import './HomeLayout.css';

interface HomeLayoutProps {
  seo?:      SeoMeta;
  children?: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ 
  children 
}) => {
  return (
    <>
      <Header nav={nav} mega={mega} />

      <main className="layout__main" id="main-content">
        {children || <Outlet />}
      </main>

      <Footer />
      <Scripts mega={mega} />
    </>
  );
};

export default HomeLayout;
