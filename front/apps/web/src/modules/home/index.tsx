// ─── Home Module — Central Export Point ──────────────────────────────────────

// Layout
export { default as HomeLayout } from './pages/HomeLayout';

// Shared Components
export { default as HomeHeader } from './components/Header/Header';
export { default as HomeFooter } from './components/Footer/Footer';
export { default as HomeHead }   from './components/SEO/Head';

// Pages (fully implemented)
export { default as HomePage }           from './pages/Home/Home';
export { default as AccommodationPage }  from './pages/Accommodation/Accommodation';
export { default as ArticlePage }        from './pages/Article/Article';
export { default as ArticlesPage }       from './pages/Articles/Articles';
// CityPage is imported directly in router (uses useParams — no props needed)
export { default as ContactPage }        from './pages/Contact/Contact';
export { default as CorporatePage }      from './pages/Corporate/Corporate';
export { default as ExploreAboutPage }   from './pages/ExploreAbout/ExploreAbout';
export { default as ExploreCulturePage } from './pages/ExploreCulture/ExploreCulture';
export { default as ExploreNaturePage }  from './pages/ExploreNature/ExploreNature';

// Pages (coming soon — uncomment when ready)
// export { default as DiscoverCardPage }   from './pages/DiscoverCard/DiscoverCard';
// export { default as ThingsToDoPage }     from './pages/ThingsToDo/ThingsToDo';
// export { default as TransportationPage } from './pages/Transportation/Transportation';
