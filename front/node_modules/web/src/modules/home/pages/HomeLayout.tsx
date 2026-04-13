import React from 'react';
import Header  from '../components/Header/Header';
import Footer  from '../components/Footer/Footer';
import FAQ     from '../components/FAQ/FAQ';
import Scripts from '../components/SEO/Scripts';
import { nav, mega } from '../services/homeNav';
import type { SeoMeta } from '../types/home.types';
import './HomeLayout.css';

interface HomeLayoutProps {
  seo:       SeoMeta;
  children:  React.ReactNode;
  showFaq?:  boolean;
}

export default function HomeLayout({
  
  children,
  showFaq  = false,
  
}: HomeLayoutProps) {
  return (
    <>
      <Header nav={nav} mega={mega} />

      <main className="layout__main" id="main-content">
        {children}
      </main>

     

      <Footer />
      <Scripts mega={mega} />
    </>
  );
}
