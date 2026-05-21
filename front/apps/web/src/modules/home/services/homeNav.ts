import type { MegaMenu, NavItem } from '../types/home.types';

export const mega: MegaMenu = {
  explore: {
    links: [
      { t: 'About Karabakh',    d: 'Region overview and highlights',   href: '/explore/about' },
      { t: 'Culture & Traditions', d: 'Heritage, architecture, stories', href: '/explore/culture' },
      { t: 'Nature & Landscapes',  d: 'Mountains, forests, scenery',    href: '/explore/nature' },
      { t: 'Articles',             d: 'Guides and travel stories',       href: '/explore/articles' },
    ],
  },
  things: {
    links: [
      { t: 'Must-see Places', d: 'Top attractions and landmarks',   href: '/things-to-do/attractions' },
      { t: 'Food & Drink',    d: 'Restaurants, cafes, cuisine',     href: '/things-to-do/restaurants' },
      { t: 'Guided Tours',    d: 'Expert-led city and nature tours', href: '/things-to-do/tours' },
      { t: 'Health & Wellness', d: 'Spa, relaxation, wellbeing',    href: '/things-to-do/wellness' },
    ],
  },
  where: {
    links: [
      { t: 'Shusha',    d: 'Cultural capital and historic landmarks', href: '/where/shusha' },
      { t: 'Khankendi', d: 'Modern city life and local culture',      href: '/where/khankendi' },
      { t: 'Aghdam',    d: 'Heritage sites and revival stories',      href: '/where/agdam' },
      { t: 'Lachin',    d: 'Mountain nature and scenic routes',       href: '/where/lachin' },
      { t: 'Fuzuli',    d: 'Gateway city with growing tourism',       href: '/where/fuzuli' },
      { t: 'Aghdere',   d: 'Forests, rivers and peaceful views',     href: '/where/aghdere' },
      { t: 'Kalbajar',  d: 'Wild landscapes and alpine lakes',        href: '/where/kalbajar' },
    ],
  },
  plan: {
    links: [
      { t: 'Visa & Permission',       d: 'Entry rules and documents',    href: '/plan/visa-permissions' },
      { t: 'Transportation',          d: 'Flights, routes and transfers', href: '/plan/transportation' },
      { t: 'Accommodation',           d: 'Hotels, stays and lodging',    href: '/plan/accommodation' },
      { t: 'Discover Card & Passes',  d: 'Rewards, discounts and loyalty', href: '/card-and-passes' },
    ],
  },
  corporate: {
    links: [
      { t: 'Partnerships',      d: 'Collaborations and strategic alliances',   href: '/corporate/partnerships' },
      { t: 'Investments',       d: 'Business opportunities and economic growth', href: '/corporate/investments' },
      { t: 'Jobs Hub',          d: 'Career opportunities and talent acquisition', href: '/corporate/jobs' },
      { t: 'International Corner', d: 'Global relations and foreign cooperation', href: '/corporate/international' },
    ],
  },
};

export const nav: NavItem[] = [
  { label: 'Explore Karabakh', href: '#explore',   key: 'explore' },
  { label: 'Where to go',      href: '#where',     key: 'where' },
  { label: 'Things to do',     href: '#things',    key: 'things' },
  { label: 'Plan your trip',   href: '#plan',      key: 'plan' },
  { label: 'Corporate',        href: '#corporate', key: 'corporate' },
];
