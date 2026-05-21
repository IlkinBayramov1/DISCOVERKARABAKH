const cities = {
shusha: {
  name: "Shusha",
  subtitle: "Culture, music heritage, historic streets and viewpoints.",
  heroImg:
    "https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg",
  aboutHeroTitle: "Your Shusha journey starts here",
  aboutLong: [
    "Shusha is widely known as one of Karabakh’s cultural centers, shaped by heritage streets, music history, and panoramic viewpoints that overlook the surrounding landscapes.",
    "The city’s character is best felt on foot: short walks connect restored landmarks, scenic terraces, and calm public spaces where you can slow down and take in the atmosphere.",
    "Cultural stops—museums, heritage routes, and local venues—help you understand why Shusha has a special place in Azerbaijan’s arts and identity. Even a short visit gives strong context to the region.",
    "For visitors, Shusha works well as a core destination or as part of a broader Karabakh itinerary. Start with the historic streets, then move toward viewpoints and curated cultural highlights.",
  ],
  aboutImages: [
    "https://cdn-attachments.timesofmalta.com/923a5fabfa0b41ebc6c9778a7d4dfcea653bf0bf-1660309974-3c96ebec-1920x1280.jpg",
    "https://files.modern.az/articles/2019/10/14/350466.jpg"
  ],
  aboutCtaHref: "/explore/articles",
  aboutCtaText: "Discover more",

  attractionsIntro:
    "From cultural heritage spots to iconic viewpoints, these are the most popular places to start with.",

  attractions: [
    {
      title: "Historic streets",
      desc: "Walk through restored heritage lanes and traditional architecture across the old city.",
      img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/shusha-historic-streets"
    },
    {
      title: "Panoramic viewpoints",
      desc: "Enjoy elevated lookouts with wide landscape views — especially impressive at sunset.",
      img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/shusha-viewpoints"
    },
    {
      title: "Cultural museums",
      desc: "Explore local museums highlighting the region’s music, arts, and historical identity.",
      img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/shusha-museums"
    },
    {
      title: "Music heritage sites",
      desc: "Discover places connected to Shusha’s long tradition as a center of Azerbaijani music.",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/shusha-music-heritage"
    },
  ],

  things: {
    title: "Discover the many sides of Shusha",
    subtitle: "Explore experiences for different travel styles.",
    categories: [
      {
        slug: "culture",
        title: "Culture & heritage",
        teaser: "Museums, landmarks, and stories.",
        img: "https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg",
        panel: {
          headline: "Culture routes",
          body:
            "Explore heritage streets, curated museums, and cultural venues. Ideal for slow walks and meaningful stops.",
          ctaText: "Discover more",
          ctaHref: "/things/shusha/culture",
          tiles: [
            { title: "Heritage Walk", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", href: "/things/shusha/heritage-walk" },
            { title: "Museum Highlights", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80", href: "/things/shusha/museums" }
          ]
        }
      },

      {
        slug: "adventure",
        title: "Adventure",
        teaser: "Trails, viewpoints, active stops.",
        img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Active exploration",
          body:
            "Short hikes, scenic routes, and photo stops that reward you with panoramic views.",
          ctaText: "Explore adventure",
          ctaHref: "/things/shusha/adventure",
          tiles: [
            { title: "Viewpoint Trail", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", href: "/things/shusha/viewpoints" },
            { title: "Sunset Spots", img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80", href: "/things/shusha/sunset" }
          ]
        }
      },

      {
        slug: "nature",
        title: "Nature",
        teaser: "Landscapes and scenic escapes.",
        img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Nature moments",
          body:
            "Breathe, slow down, and enjoy open landscapes, photo viewpoints, and easy scenic stops.",
          ctaText: "See nature ideas",
          ctaHref: "/things/shusha/nature",
          tiles: [
            { title: "Scenic Drive", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", href: "/things/shusha/scenic-drive" },
            { title: "Photo Points", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", href: "/things/shusha/photo" }
          ]
        }
      },

      {
        slug: "wellness",
        title: "Wellness",
        teaser: "Relaxed, quiet activities.",
        img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Wellness escape",
          body:
            "Light walking, calm viewpoints, and peaceful breaks designed for a slower pace.",
          ctaText: "Wellness ideas",
          ctaHref: "/things/shusha/wellness",
          tiles: [
            { title: "Calm Walks", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", href: "/things/shusha/calm-walks" },
            { title: "Quiet Viewpoints", img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80", href: "/things/shusha/quiet-viewpoints" }
          ]
        }
      }
    ]
  },

  faq: [
    {
      q: "How long should I spend in Shusha?",
      a: "Most visitors spend one full day exploring the historic streets, viewpoints, and main cultural sites. If you want a slower pace or photography time, consider staying overnight."
    },
    {
      q: "Is Shusha walkable?",
      a: "Yes. The historic center is best explored on foot. Comfortable shoes are recommended due to slopes and stone streets."
    },
    {
      q: "Do I need a permit to visit?",
      a: "Check the latest travel regulations before planning your trip, as access rules may change depending on official requirements."
    },
    {
      q: "What are the main highlights?",
      a: "Visitors usually prioritize viewpoints, cultural landmarks, walking routes, and heritage sites connected to the city’s music history."
    },
    {
      q: "Is Shusha suitable for families?",
      a: "Yes. Many areas are calm and suitable for relaxed visits, though some routes involve walking and elevation."
    },
    {
      q: "Can I visit as part of a day trip?",
      a: "Yes. Shusha works well as a day trip from nearby cities, but staying longer allows time to explore the surroundings."
    }
  ],

  plan: [
    {
      h: "Getting there",
      p: "Confirm entry requirements, routes, and transfer options before you travel.",
    },
    {
      h: "Where to stay",
      p: "Pick a central location for easy walking access and quick city mobility.",
    },
    {
      h: "What to pack",
      p: "Comfortable shoes for hills/stone paths and a light jacket for evenings.",
    },
  ],

  related: [
    { slug: "khankendi", name: "Khankendi", img: "https://www.azernews.az/media/2023/08/03/eko7spowaaah2rq.jpg", desc: "Urban life, dining spots, and events." },
    { slug: "agdam", name: "Aghdam", img: "https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg", desc: "Modern development and memorial sites." },
    { slug: "lachin", name: "Lachin", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", desc: "Mountains, nature trails, and scenic routes." },
    { slug: "fuzuli", name: "Fuzuli", img: "https://admin.aztv.az//userfiles/old/news/2024/10/15/1071815.jpg", desc: "Gateway city and regional connections." },
    { slug: "kalbajar", name: "Kalbajar", img: "https://azertag.az/files/2020/3/1200x630/16063103252274430396_1200x630.jpg", desc: "Wild landscapes and alpine views." },
    { slug: "aghdere", name: "Aghdere", img: "https://azertag.az/files/2026/1/1200x630/17692457786396059587_1200x630.jpg?v=697836100498d", desc: "Forests, rivers, and calm scenery." },
  ],
},

khankendi: {
  name: "Khankendi",
  subtitle: "Urban center, city parks, dining spots and local life.",
  heroImg:
    "https://www.azernews.az/media/2023/08/03/eko7spowaaah2rq.jpg",

  aboutHeroTitle: "Your Khankendi journey starts here",

  aboutLong: [
    "Khankendi is the main urban hub of the region, known for its city atmosphere, local neighborhoods, and everyday rhythm shaped by cafés, parks, and public spaces.",
    "Unlike heritage-focused destinations, Khankendi offers a more modern experience. Wide streets, central squares, and green areas make it easy to explore while discovering local dining spots and social venues.",
    "The city works well as a base for exploring nearby destinations, while also offering enough urban life to fill a full day — from parks and viewpoints to relaxed restaurants and evening walks.",
    "For visitors, Khankendi is best approached as a practical and lively stop in a Karabakh itinerary: start with the central districts, then explore parks, local cafés, and nearby viewpoints.",
  ],

  aboutImages: [
    "https://upload.wikimedia.org/wikipedia/commons/2/2e/Stepanakert_panorama.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Stepanakert_center.jpg"
  ],

  aboutCtaHref: "/explore/articles",
  aboutCtaText: "Discover more",

  attractionsIntro:
    "From lively public spaces to urban viewpoints, these are the most popular places to start with.",

  attractions: [
    {
      title: "Central square",
      desc: "Walk through the main public square surrounded by local buildings and city activity.",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/khankendi-central-square"
    },
    {
      title: "City parks",
      desc: "Relax in green public parks with walking paths, benches, and everyday local life.",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/khankendi-parks"
    },
    {
      title: "Urban viewpoints",
      desc: "Find elevated spots around the city offering broad views of neighborhoods and hills.",
      img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/khankendi-viewpoints"
    },
    {
      title: "Local dining streets",
      desc: "Explore areas known for cafés, casual restaurants, and evening city walks.",
      img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/khankendi-dining-streets"
    },
  ],

  things: {
    title: "Discover the many sides of Khankendi",
    subtitle: "Explore experiences for different travel styles.",

    categories: [
      {
        slug: "urban",
        title: "City life",
        teaser: "Squares, cafés, and local rhythm.",
        img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Urban exploration",
          body:
            "Walk central districts, enjoy cafés, and experience the everyday pace of the region’s main city.",
          ctaText: "Discover more",
          ctaHref: "/things/khankendi/urban",
          tiles: [
            { title: "Central Walk", img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80", href: "/things/khankendi/central-walk" },
            { title: "Cafe Route", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80", href: "/things/khankendi/cafes" }
          ]
        }
      },

      {
        slug: "parks",
        title: "Parks & walks",
        teaser: "Green spaces and relaxed strolls.",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "City nature",
          body:
            "Enjoy calm public parks, shaded paths, and quiet areas perfect for slow walks.",
          ctaText: "Explore parks",
          ctaHref: "/things/khankendi/parks",
          tiles: [
            { title: "Park Loop", img: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?auto=format&fit=crop&w=1200&q=80", href: "/things/khankendi/park-loop" },
            { title: "Evening Walks", img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80", href: "/things/khankendi/evening-walk" }
          ]
        }
      },

      {
        slug: "food",
        title: "Food & cafés",
        teaser: "Dining spots and local favorites.",
        img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Local dining",
          body:
            "Discover casual restaurants, cafés, and relaxed spots ideal for breaks between exploring.",
          ctaText: "See dining ideas",
          ctaHref: "/things/khankendi/food",
          tiles: [
            { title: "Cafe Stops", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80", href: "/things/khankendi/cafe-stops" },
            { title: "Dinner Areas", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80", href: "/things/khankendi/dinner" }
          ]
        }
      },

      {
        slug: "viewpoints",
        title: "Viewpoints",
        teaser: "City panoramas and photo spots.",
        img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "City views",
          body:
            "Find elevated points and quiet corners that give wide views over the city and hills.",
          ctaText: "View photo spots",
          ctaHref: "/things/khankendi/viewpoints",
          tiles: [
            { title: "City Panorama", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", href: "/things/khankendi/panorama" },
            { title: "Sunset Points", img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80", href: "/things/khankendi/sunset" }
          ]
        }
      }
    ]
  },

  faq: [
    {
      q: "How long should I spend in Khankendi?",
      a: "One day is usually enough to explore the city center, parks, and dining areas. If using it as a base for nearby destinations, consider staying longer."
    },
    {
      q: "Is Khankendi walkable?",
      a: "Yes. Central areas are easy to explore on foot, though some outer districts may require transport."
    },
    {
      q: "Is Khankendi suitable as a base city?",
      a: "Yes. Many visitors use Khankendi as a practical base for exploring surrounding destinations in the region."
    },
    {
      q: "What are the main highlights?",
      a: "Visitors typically focus on the central square, parks, dining streets, and viewpoints."
    },
    {
      q: "Is it good for evening activities?",
      a: "Yes. Cafés, restaurants, and public spaces make the city pleasant for relaxed evenings."
    },
    {
      q: "Can I visit on a short trip?",
      a: "Yes. Khankendi works well as a short stop or as part of a multi-city Karabakh itinerary."
    }
  ],

  plan: [
    {
      h: "Getting there",
      p: "Check current routes, transfer options, and travel requirements before departure.",
    },
    {
      h: "Where to stay",
      p: "Choose a central area for easy walking access to cafés, parks, and main streets.",
    },
    {
      h: "What to pack",
      p: "Comfortable walking shoes and light layers for cooler evenings are recommended.",
    },
  ],

  related: [
    { slug: "shusha", name: "Shusha", img: "https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg", desc: "Culture, music heritage, and viewpoints." },
    { slug: "agdam", name: "Aghdam", img: "https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg", desc: "Revival city and heritage sites." },
    { slug: "lachin", name: "Lachin", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", desc: "Mountains, trails, and nature." },
    { slug: "fuzuli", name: "Fuzuli", img: "https://admin.aztv.az//userfiles/old/news/2024/10/15/1071815.jpg", desc: "Gateway city and transport hub." },
    { slug: "kalbajar", name: "Kalbajar", img: "https://azertag.az/files/2020/3/1200x630/16063103252274430396_1200x630.jpg", desc: "Wild landscapes and alpine views." },
    { slug: "aghdere", name: "Aghdere", img: "https://azertag.az/files/2026/1/1200x630/17692457786396059587_1200x630.jpg?v=697836100498d", desc: "Forests and calm scenery." },
  ],
},

agdam: {
  name: "Aghdam",
  subtitle: "Revival city, memorial sites, open landscapes and regional routes.",
  heroImg:
    "https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg",

  aboutHeroTitle: "Your Aghdam journey starts here",

  aboutLong: [
    "Aghdam is one of Karabakh’s most symbolic destinations, known for its memorial spaces, reconstruction projects, and wide open surroundings that reflect both history and renewal.",
    "Unlike compact historic cities, Aghdam’s character is defined by its scale. Broad areas, new development zones, and landmark sites create a powerful sense of space and transformation.",
    "Visitors often come to understand the region’s story through key memorial stops, cultural markers, and guided routes that explain Aghdam’s past and future direction.",
    "Aghdam works well as a meaningful stop within a Karabakh itinerary. Start with the main memorial locations, then continue through surrounding viewpoints and regional connections.",
  ],

  aboutImages: [
    "https://upload.wikimedia.org/wikipedia/commons/1/1c/Aghdam_ruins_2010.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/64/Aghdam_mosque_view.jpg"
  ],

  aboutCtaHref: "/explore/articles",
  aboutCtaText: "Discover more",

  attractionsIntro:
    "From symbolic landmarks to wide open viewpoints, these are the most important places to begin your visit.",

  attractions: [
    {
      title: "Aghdam Mosque area",
      desc: "Visit one of the region’s most recognized landmarks and surrounding historic grounds.",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/agdam-mosque"
    },
    {
      title: "Memorial routes",
      desc: "Follow guided paths connecting key symbolic sites across the city.",
      img: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/agdam-memorial-route"
    },
    {
      title: "Reconstruction zones",
      desc: "Observe new development areas that show the city’s rebuilding and future plans.",
      img: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/agdam-redevelopment"
    },
    {
      title: "Open viewpoints",
      desc: "Experience wide panoramas and open landscapes around the city’s outskirts.",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/agdam-viewpoints"
    },
  ],

  things: {
    title: "Discover the many sides of Aghdam",
    subtitle: "Explore experiences for different travel styles.",

    categories: [
      {
        slug: "heritage",
        title: "History & memory",
        teaser: "Landmarks, routes, and context.",
        img: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Heritage routes",
          body:
            "Explore symbolic locations, memorial paths, and key sites that explain Aghdam’s story.",
          ctaText: "Discover more",
          ctaHref: "/things/agdam/heritage",
          tiles: [
            { title: "Memorial Walk", img: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&q=80", href: "/things/agdam/memorial-walk" },
            { title: "Historic Landmarks", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", href: "/things/agdam/landmarks" }
          ]
        }
      },

      {
        slug: "future",
        title: "City revival",
        teaser: "Reconstruction and new plans.",
        img: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Future city",
          body:
            "Discover redevelopment zones, infrastructure projects, and how the city is being rebuilt.",
          ctaText: "Explore development",
          ctaHref: "/things/agdam/revival",
          tiles: [
            { title: "New Districts", img: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80", href: "/things/agdam/districts" },
            { title: "Urban Plans", img: "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&w=1200&q=80", href: "/things/agdam/plans" }
          ]
        }
      },

      {
        slug: "routes",
        title: "Regional routes",
        teaser: "Connections and open drives.",
        img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Travel routes",
          body:
            "Use Aghdam as a connection point to explore surrounding destinations and scenic roads.",
          ctaText: "See route ideas",
          ctaHref: "/things/agdam/routes",
          tiles: [
            { title: "Scenic Drives", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", href: "/things/agdam/drives" },
            { title: "Nearby Stops", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", href: "/things/agdam/nearby" }
          ]
        }
      },

      {
        slug: "viewpoints",
        title: "Open landscapes",
        teaser: "Wide views and calm spaces.",
        img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Landscape stops",
          body:
            "Pause at wide open viewpoints and quiet spaces around the city’s edges.",
          ctaText: "Find viewpoints",
          ctaHref: "/things/agdam/viewpoints",
          tiles: [
            { title: "Panorama Stops", img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80", href: "/things/agdam/panorama" },
            { title: "Photo Areas", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", href: "/things/agdam/photo" }
          ]
        }
      }
    ]
  },

  faq: [
    {
      q: "How long should I spend in Aghdam?",
      a: "Most visitors spend half a day to one full day exploring the main memorial and landmark areas."
    },
    {
      q: "Is Aghdam suitable for walking?",
      a: "Some key areas can be explored on foot, but due to distances between sites, transport is recommended."
    },
    {
      q: "What makes Aghdam unique?",
      a: "The city represents both history and renewal, with symbolic landmarks and major reconstruction projects."
    },
    {
      q: "Is it good for photography?",
      a: "Yes. Wide open landscapes, architecture, and viewpoints make it visually distinctive."
    },
    {
      q: "Can I combine it with other destinations?",
      a: "Yes. Many travelers combine Aghdam with Shusha, Khankendi, or regional drives."
    },
    {
      q: "Is it suitable for a short stop?",
      a: "Yes. Aghdam works well as a meaningful stop within a multi-city Karabakh route."
    }
  ],

  plan: [
    {
      h: "Getting there",
      p: "Check routes, travel permissions, and transport options before departure.",
    },
    {
      h: "Where to stay",
      p: "Most visitors stay in nearby cities and visit Aghdam as a day stop.",
    },
    {
      h: "What to pack",
      p: "Comfortable walking shoes and sun protection are recommended due to open areas.",
    },
  ],

  related: [
    { slug: "shusha", name: "Shusha", img: "https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg", desc: "Culture, music heritage, and viewpoints." },
    { slug: "khankendi", name: "Khankendi", img: "https://www.azernews.az/media/2023/08/03/eko7spowaaah2rq.jpg", desc: "Urban life and dining spots." },
    { slug: "lachin", name: "Lachin", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", desc: "Mountains, nature trails, and views." },
    { slug: "fuzuli", name: "Fuzuli", img: "https://admin.aztv.az//userfiles/old/news/2024/10/15/1071815.jpg", desc: "Gateway city and connections." },
    { slug: "kalbajar", name: "Kalbajar", img: "https://azertag.az/files/2020/3/1200x630/16063103252274430396_1200x630.jpg", desc: "Wild landscapes and alpine scenery." },
    { slug: "aghdere", name: "Aghdere", img: "https://azertag.az/files/2026/1/1200x630/17692457786396059587_1200x630.jpg?v=697836100498d", desc: "Forests, rivers, and calm nature." },
  ],
},

lachin: {
  name: "Lachin",
  subtitle: "Mountain corridor, highland villages, river valleys and panoramic routes.",
  heroImg:
    "https://upload.wikimedia.org/wikipedia/commons/0/08/La%C3%A7%C4%B1n_%C5%9F%C9%99h%C9%99rinin_%C3%BCmumi_g%C3%B6r%C3%BCn%C3%BC%C5%9F%C3%BC.jpg",

  aboutHeroTitle: "Your Lachin journey starts here",

  aboutLong: [
    "Lachin is one of Karabakh’s most scenic mountain regions, shaped by highland landscapes, long valleys, and quiet village life.",
    "The experience here is less about city streets and more about open nature: winding roads, viewpoint stops, river crossings, and fresh-air hiking routes.",
    "Many visitors come for the feeling of altitude and space—forests, slopes, and wide horizons that make Lachin ideal for slow travel and photography.",
    "Lachin works best as a nature-focused part of a Karabakh itinerary. Start with a main viewpoint stop, then continue with short trails, village drives, and regional connections.",
  ],

  aboutImages: [
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80"
  ],

  aboutCtaHref: "/explore/articles",
  aboutCtaText: "Discover more",

  attractionsIntro:
    "From high viewpoints to valley routes, these stops help you feel Lachin’s landscape and rhythm.",

  attractions: [
    {
      title: "Mountain viewpoints",
      desc: "Pause at high-elevation stops for wide panoramas and clean horizon lines.",
      img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/lachin-viewpoints"
    },
    {
      title: "River valley drives",
      desc: "Follow scenic roads through valleys with calm stops and photo points.",
      img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/lachin-valley-drives"
    },
    {
      title: "Nature trails",
      desc: "Short hikes and walking routes for fresh air, forest edges, and mountain silence.",
      img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/lachin-trails"
    },
    {
      title: "Highland village atmosphere",
      desc: "Experience simple local life, traditional rhythms, and mountain hospitality.",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/lachin-villages"
    },
  ],

  things: {
    title: "Discover the mountain character of Lachin",
    subtitle: "Choose experiences based on your travel style.",

    categories: [
      {
        slug: "nature",
        title: "Nature & trails",
        teaser: "Hikes, fresh air, and calm routes.",
        img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Trail time",
          body:
            "Explore short hiking routes, forest edges, and open ridgelines for a slow, nature-first day.",
          ctaText: "Explore trails",
          ctaHref: "/things/lachin/nature",
          tiles: [
            { title: "Short Hike Loop", img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1200&q=80", href: "/things/lachin/short-hike" },
            { title: "Forest Walk", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", href: "/things/lachin/forest-walk" }
          ]
        }
      },

      {
        slug: "views",
        title: "Viewpoints",
        teaser: "Panoramas and photo stops.",
        img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Panorama stops",
          body:
            "Drive between high points and scenic pullovers that showcase the region’s mountain scale.",
          ctaText: "Find viewpoints",
          ctaHref: "/things/lachin/viewpoints",
          tiles: [
            { title: "Golden Hour Point", img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80", href: "/things/lachin/golden-hour" },
            { title: "Wide Horizon Spot", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", href: "/things/lachin/horizon" }
          ]
        }
      },

      {
        slug: "culture",
        title: "Highland culture",
        teaser: "Village life and traditions.",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Mountain traditions",
          body:
            "Discover village hospitality, local storytelling, and cultural touches that reflect a highland way of life.",
          ctaText: "Discover culture",
          ctaHref: "/things/lachin/culture",
          tiles: [
            { title: "Village Visit", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", href: "/things/lachin/village-visit" },
            { title: "Story & Music Night", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", href: "/things/lachin/story-music" }
          ]
        }
      },

      {
        slug: "routes",
        title: "Mountain drives",
        teaser: "Scenic roads and connections.",
        img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Road trip mode",
          body:
            "Use Lachin’s mountain routes to connect scenic stops and build a flexible day itinerary.",
          ctaText: "See route ideas",
          ctaHref: "/things/lachin/routes",
          tiles: [
            { title: "Valley Drive", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", href: "/things/lachin/valley-drive" },
            { title: "Viewpoint Circuit", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", href: "/things/lachin/viewpoint-circuit" }
          ]
        }
      }
    ]
  },

  faq: [
    {
      q: "How long should I spend in Lachin?",
      a: "Most visitors spend one full day for viewpoints and short trails, or two days if adding villages and slower routes."
    },
    {
      q: "Is Lachin suitable for hiking?",
      a: "Yes. The region works well for short hikes and nature walks, especially around viewpoints and valley paths."
    },
    {
      q: "What makes Lachin different from other destinations?",
      a: "It’s defined by mountain scale: long scenic roads, high elevation viewpoints, and calm highland atmosphere."
    },
    {
      q: "Is it good for photography?",
      a: "Yes. Wide horizons, changing light, and layered mountain landscapes make it a strong photography destination."
    },
    {
      q: "Can I combine Lachin with other places?",
      a: "Yes. Many travelers connect Lachin with Kalbajar for nature, or with Shusha/Khankendi for mixed culture + scenery."
    },
    {
      q: "Is it suitable for a short stop?",
      a: "Yes. Even a few hours works if you focus on one or two viewpoint stops along a route."
    }
  ],

  plan: [
    {
      h: "Getting there",
      p: "Confirm current route access, road conditions, and the best driving times for mountain areas.",
    },
    {
      h: "Where to stay",
      p: "Consider nearby bases for overnight stays, then explore Lachin by day with planned scenic stops.",
    },
    {
      h: "What to pack",
      p: "Layered clothing, walking shoes, and water are recommended—weather can change quickly in higher areas.",
    },
  ],

  related: [
    { slug: "kalbajar", name: "Kalbajar", img: "https://azertag.az/files/2020/3/1200x630/16063103252274430396_1200x630.jpg", desc: "Alpine scenery and mineral springs." },
    { slug: "shusha", name: "Shusha", img: "https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg", desc: "Culture, music heritage, and viewpoints." },
    { slug: "khankendi", name: "Khankendi", img: "https://www.azernews.az/media/2023/08/03/eko7spowaaah2rq.jpg", desc: "Urban life and dining spots." },
    { slug: "agdam", name: "Aghdam", img: "https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg", desc: "Revival city and memorial routes." },
    { slug: "fuzuli", name: "Fuzuli", img: "https://admin.aztv.az//userfiles/old/news/2024/10/15/1071815.jpg", desc: "Gateway city and connections." },
    { slug: "aghdere", name: "Aghdere", img: "https://azertag.az/files/2026/1/1200x630/17692457786396059587_1200x630.jpg?v=697836100498d", desc: "Forests, rivers, and calm nature." },
  ],
},

fuzuli: {
  name: "Fuzuli",
  subtitle: "Gateway city, transport hub, open plains and regional connections.",
  heroImg:
    "https://admin.aztv.az//userfiles/old/news/2024/10/15/1071815.jpg",

  aboutHeroTitle: "Your Fuzuli journey starts here",

  aboutLong: [
    "Fuzuli is one of Karabakh’s key entry points, known for its transport links, open plains, and strategic position connecting multiple destinations.",
    "Unlike historic mountain towns, Fuzuli’s identity is shaped by movement and access. It serves as a gateway for visitors arriving to explore the wider region.",
    "Travelers often pass through Fuzuli on the way to Shusha, Aghdam, or other destinations, but the area also offers wide landscapes, developing infrastructure, and a sense of regional scale.",
    "Fuzuli works best as the starting point of a Karabakh itinerary. Begin with arrival logistics, then continue onward to surrounding cities and routes.",
  ],

  aboutImages: [
    "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
  ],

  aboutCtaHref: "/explore/articles",
  aboutCtaText: "Discover more",

  attractionsIntro:
    "From arrival points to open landscape routes, these are the key places to begin your visit.",

  attractions: [
    {
      title: "Fuzuli transport gateway",
      desc: "Start your journey from the region’s main arrival infrastructure and transport links.",
      img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/fuzuli-gateway"
    },
    {
      title: "Regional road connections",
      desc: "Follow the main routes linking Fuzuli to Shusha, Aghdam, and other Karabakh destinations.",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/fuzuli-routes"
    },
    {
      title: "Open plains viewpoints",
      desc: "Experience wide horizons and flatland scenery that contrast with Karabakh’s mountain regions.",
      img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/fuzuli-plains"
    },
    {
      title: "Development zones",
      desc: "Observe new infrastructure, planning projects, and the region’s rebuilding direction.",
      img: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/fuzuli-development"
    },
  ],

  things: {
    title: "Explore the gateway role of Fuzuli",
    subtitle: "Choose how to experience the region from its main entry point.",

    categories: [
      {
        slug: "arrival",
        title: "Arrival & logistics",
        teaser: "Starting point for your trip.",
        img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Begin your journey",
          body:
            "Understand arrival routes, transport options, and how to plan your movement into the wider Karabakh region.",
          ctaText: "Plan arrival",
          ctaHref: "/things/fuzuli/arrival",
          tiles: [
            { title: "Arrival Guide", img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1200&q=80", href: "/things/fuzuli/arrival-guide" },
            { title: "Transport Options", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", href: "/things/fuzuli/transport" }
          ]
        }
      },

      {
        slug: "routes",
        title: "Regional routes",
        teaser: "Road connections across Karabakh.",
        img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Route planning",
          body:
            "Use Fuzuli as your base to connect to Shusha, Aghdam, Lachin, and other destinations through main travel corridors.",
          ctaText: "See routes",
          ctaHref: "/things/fuzuli/routes",
          tiles: [
            { title: "To Shusha Route", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", href: "/things/fuzuli/shusha-route" },
            { title: "Multi-city Drive", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", href: "/things/fuzuli/multi-city" }
          ]
        }
      },

      {
        slug: "landscape",
        title: "Open landscapes",
        teaser: "Wide plains and calm views.",
        img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Flatland scenery",
          body:
            "Explore the open terrain around Fuzuli for photography stops, quiet breaks, and contrast with mountain areas.",
          ctaText: "Find viewpoints",
          ctaHref: "/things/fuzuli/landscape",
          tiles: [
            { title: "Panorama Stop", img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80", href: "/things/fuzuli/panorama" },
            { title: "Photo Field", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", href: "/things/fuzuli/photo-field" }
          ]
        }
      },

      {
        slug: "future",
        title: "Regional development",
        teaser: "Infrastructure and rebuilding.",
        img: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Future corridor",
          body:
            "See how Fuzuli functions as a key infrastructure point supporting tourism, transport, and regional growth.",
          ctaText: "Explore projects",
          ctaHref: "/things/fuzuli/development",
          tiles: [
            { title: "New Infrastructure", img: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80", href: "/things/fuzuli/infrastructure" },
            { title: "Regional Hub Role", img: "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&w=1200&q=80", href: "/things/fuzuli/hub-role" }
          ]
        }
      }
    ]
  },

  faq: [
    {
      q: "How long should I spend in Fuzuli?",
      a: "Most visitors spend a few hours or half a day here before continuing to other Karabakh destinations."
    },
    {
      q: "Is Fuzuli mainly a transit point?",
      a: "Yes. It functions primarily as an arrival gateway, though it also offers landscapes and route connections."
    },
    {
      q: "What makes Fuzuli important?",
      a: "Its role as the region’s main transport entry point and connection hub makes it strategically important."
    },
    {
      q: "Is it suitable for photography?",
      a: "Yes. Open plains, road horizons, and wide skies provide strong minimal landscape photography opportunities."
    },
    {
      q: "Can I start my Karabakh trip here?",
      a: "Yes. Many itineraries begin in Fuzuli before moving toward mountain or cultural destinations."
    },
    {
      q: "Is it good for overnight stays?",
      a: "Some travelers stay briefly, but most continue to other cities for accommodation."
    }
  ],

  plan: [
    {
      h: "Getting there",
      p: "Check arrival permissions, airport logistics, and onward transport routes before departure.",
    },
    {
      h: "Where to stay",
      p: "Many visitors continue to Shusha or nearby cities for overnight stays after arriving.",
    },
    {
      h: "What to pack",
      p: "Sun protection and comfortable travel clothing are useful due to open terrain and transit movement.",
    },
  ],

  related: [
    { slug: "shusha", name: "Shusha", img: "https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg", desc: "Culture, music heritage, and viewpoints." },
    { slug: "agdam", name: "Aghdam", img: "https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg", desc: "Memorial routes and revival spaces." },
    { slug: "lachin", name: "Lachin", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", desc: "Mountains, trails, and highland scenery." },
    { slug: "khankendi", name: "Khankendi", img: "https://www.azernews.az/media/2023/08/03/eko7spowaaah2rq.jpg", desc: "Urban life and dining spots." },
    { slug: "kalbajar", name: "Kalbajar", img: "https://azertag.az/files/2020/3/1200x630/16063103252274430396_1200x630.jpg", desc: "Alpine landscapes and mineral springs." },
    { slug: "aghdere", name: "Aghdere", img: "https://azertag.az/files/2026/1/1200x630/17692457786396059587_1200x630.jpg?v=697836100498d", desc: "Forests, rivers, and calm nature." },
  ],
},

aghdere: {
  name: "Aghdere",
  subtitle: "Forests, rivers, quiet valleys and nature-first routes.",
  heroImg:
    "https://azertag.az/files/2026/1/1200x630/17692457786396059587_1200x630.jpg?v=697836100498d",

  aboutHeroTitle: "Your Aghdere journey starts here",

  aboutLong: [
    "Aghdere is a nature-focused destination in Karabakh, known for forested landscapes, river valleys, and a calmer rhythm compared to the region’s main cities.",
    "The experience here is defined by greenery and water: shaded drives, quiet stops by streams, and short walks where the scenery changes quickly with the terrain.",
    "Visitors often come to slow down—Aghdere is ideal for simple outdoor time, photography in soft natural light, and peaceful breaks between larger destinations.",
    "Aghdere works best as a scenic detour or a half-day nature stop. Start with a valley route, add one viewpoint stop, and finish with a short forest walk.",
  ],

  aboutImages: [
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1600&q=80"
  ],

  aboutCtaHref: "/explore/articles",
  aboutCtaText: "Discover more",

  attractionsIntro:
    "From forest routes to riverside stops, these are the best places to begin your Aghdere visit.",

  attractions: [
    {
      title: "Forest drives",
      desc: "Follow shaded roads through dense greenery with frequent calm pullovers.",
      img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/aghdere-forest-drives"
    },
    {
      title: "River valley stops",
      desc: "Pause near streams and valley bends for fresh air and quiet scenery.",
      img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/aghdere-river-valley"
    },
    {
      title: "Viewpoint clearings",
      desc: "Short climbs or roadside clearings that open up the surrounding landscape.",
      img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/aghdere-viewpoints"
    },
    {
      title: "Nature walks",
      desc: "Easy walking routes for families and casual hikers—ideal for a slow afternoon.",
      img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/aghdere-nature-walks"
    },
  ],

  things: {
    title: "Feel the calm nature of Aghdere",
    subtitle: "Pick experiences for different outdoor moods.",

    categories: [
      {
        slug: "forests",
        title: "Forests & shade",
        teaser: "Green routes and quiet stops.",
        img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Forest atmosphere",
          body:
            "Spend time on shaded roads and green corridors—ideal for slow travel and relaxed nature breaks.",
          ctaText: "Explore forests",
          ctaHref: "/things/aghdere/forests",
          tiles: [
            { title: "Green Drive Loop", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", href: "/things/aghdere/green-drive" },
            { title: "Quiet Clearing Stop", img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80", href: "/things/aghdere/clearing" }
          ]
        }
      },

      {
        slug: "rivers",
        title: "Rivers & valleys",
        teaser: "Water views and fresh air.",
        img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Valley routes",
          body:
            "Follow riverside scenery with calm pauses—perfect for short stops and simple outdoor time.",
          ctaText: "See valley ideas",
          ctaHref: "/things/aghdere/rivers",
          tiles: [
            { title: "Riverside Pause", img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80", href: "/things/aghdere/riverside" },
            { title: "Valley Photo Points", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", href: "/things/aghdere/valley-photos" }
          ]
        }
      },

      {
        slug: "walks",
        title: "Walks & easy hikes",
        teaser: "Low-effort trails for everyone.",
        img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Simple trails",
          body:
            "Choose short, accessible routes that fit a half-day plan—especially good for families and casual hikers.",
          ctaText: "Find walks",
          ctaHref: "/things/aghdere/walks",
          tiles: [
            { title: "Easy Loop Walk", img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1200&q=80", href: "/things/aghdere/easy-loop" },
            { title: "Forest Edge Trail", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", href: "/things/aghdere/forest-edge" }
          ]
        }
      },

      {
        slug: "photography",
        title: "Photography spots",
        teaser: "Soft light and natural frames.",
        img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Photo-friendly nature",
          body:
            "Capture calm scenes—green textures, water reflections, and open clearings that change with the weather.",
          ctaText: "See photo spots",
          ctaHref: "/things/aghdere/photography",
          tiles: [
            { title: "Reflection Point", img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80", href: "/things/aghdere/reflection" },
            { title: "Golden Hour Clearing", img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80", href: "/things/aghdere/golden-hour" }
          ]
        }
      }
    ]
  },

  faq: [
    {
      q: "How long should I spend in Aghdere?",
      a: "Most visitors spend half a day to one full day depending on how many nature stops and walks they plan."
    },
    {
      q: "Is Aghdere good for families?",
      a: "Yes. The calm scenery and short walking options make it suitable for family-friendly outdoor time."
    },
    {
      q: "What makes Aghdere unique?",
      a: "Its forest-and-river atmosphere—more peaceful and nature-first than the region’s main urban destinations."
    },
    {
      q: "Is it good for photography?",
      a: "Yes. Forest textures, river reflections, and soft light conditions create strong natural framing."
    },
    {
      q: "Can I combine it with other destinations?",
      a: "Yes. Many travelers add Aghdere as a scenic stop between larger cities or as a detour from main routes."
    },
    {
      q: "Is it suitable for a short stop?",
      a: "Yes. Even 2–3 hours works if you focus on one valley route and one short walk."
    }
  ],

  plan: [
    {
      h: "Getting there",
      p: "Check road conditions and plan stops—nature routes often work best with flexible timing.",
    },
    {
      h: "Where to stay",
      p: "Most visitors base in nearby cities and explore Aghdere as a day stop.",
    },
    {
      h: "What to pack",
      p: "Light rain jacket, walking shoes, and water are recommended—forest weather can shift quickly.",
    },
  ],

  related: [
    { slug: "kalbajar", name: "Kalbajar", img: "https://azertag.az/files/2020/3/1200x630/16063103252274430396_1200x630.jpg", desc: "Alpine landscapes and mineral springs." },
    { slug: "lachin", name: "Lachin", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", desc: "Mountains, trails, and highland scenery." },
    { slug: "khankendi", name: "Khankendi", img: "https://www.azernews.az/media/2023/08/03/eko7spowaaah2rq.jpg", desc: "Urban life and dining spots." },
    { slug: "shusha", name: "Shusha", img: "https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg", desc: "Culture, music heritage, and viewpoints." },
    { slug: "agdam", name: "Aghdam", img: "https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg", desc: "Memorial routes and revival spaces." },
    { slug: "fuzuli", name: "Fuzuli", img: "https://admin.aztv.az//userfiles/old/news/2024/10/15/1071815.jpg", desc: "Gateway city and transport connections." },
  ],
},

kalbajar: {
  name: "Kalbajar",
  subtitle: "Alpine landscapes, mineral springs, mountain lakes and highland routes.",
  heroImg:
    "https://azertag.az/files/2020/3/1200x630/16063103252274430396_1200x630.jpg",

  aboutHeroTitle: "Your Kalbajar journey starts here",

  aboutLong: [
    "Kalbajar is one of Karabakh’s most dramatic nature destinations, known for alpine scenery, mountain passes, forests, and natural mineral springs.",
    "The region feels higher and wilder than most of Karabakh. Long ridgelines, fresh air, and remote valleys create a strong sense of scale and isolation.",
    "Visitors often come for nature experiences—lakes, hiking routes, panoramic drives, and the long tradition of wellness linked to mineral water sources.",
    "Kalbajar works best as a full-day or multi-day nature destination. Start with a scenic drive, add a lake or spring stop, and continue with a short hike or viewpoint visit.",
  ],

  aboutImages: [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1600&q=80"
  ],

  aboutCtaHref: "/explore/articles",
  aboutCtaText: "Discover more",

  attractionsIntro:
    "From alpine lakes to mineral springs, these are the key places to start your Kalbajar journey.",

  attractions: [
    {
      title: "Mineral spring areas",
      desc: "Visit natural spring zones long associated with wellness traditions and mountain life.",
      img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/kalbajar-springs"
    },
    {
      title: "Mountain lakes",
      desc: "Explore high-altitude lakes surrounded by open ridges and fresh alpine air.",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/kalbajar-lakes"
    },
    {
      title: "Highland passes",
      desc: "Drive across elevated routes offering sweeping views and dramatic terrain changes.",
      img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/kalbajar-passes"
    },
    {
      title: "Forest valleys",
      desc: "Descend into wooded valleys ideal for calm stops, short walks, and nature photography.",
      img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
      href: "/attractions/kalbajar-valleys"
    },
  ],

  things: {
    title: "Experience the alpine side of Karabakh",
    subtitle: "Choose how you want to explore Kalbajar’s nature.",

    categories: [
      {
        slug: "lakes",
        title: "Lakes & alpine scenery",
        teaser: "High views and clean air.",
        img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Lake landscapes",
          body:
            "Visit mountain lakes for wide reflections, cool air, and a strong sense of altitude.",
          ctaText: "Explore lakes",
          ctaHref: "/things/kalbajar/lakes",
          tiles: [
            { title: "Lake Stop", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", href: "/things/kalbajar/lake-stop" },
            { title: "Ridge View", img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80", href: "/things/kalbajar/ridge-view" }
          ]
        }
      },

      {
        slug: "springs",
        title: "Mineral springs",
        teaser: "Nature and wellness traditions.",
        img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Wellness heritage",
          body:
            "Explore natural spring areas that have long been part of local health and relaxation traditions.",
          ctaText: "See spring locations",
          ctaHref: "/things/kalbajar/springs",
          tiles: [
            { title: "Spring Stop", img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80", href: "/things/kalbajar/spring-stop" },
            { title: "Valley Springs", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", href: "/things/kalbajar/valley-springs" }
          ]
        }
      },

      {
        slug: "hiking",
        title: "Hiking & trails",
        teaser: "Routes for fresh-air exploration.",
        img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Trail time",
          body:
            "Choose short hikes or longer ridge walks to fully experience Kalbajar’s mountain terrain.",
          ctaText: "Find hikes",
          ctaHref: "/things/kalbajar/hiking",
          tiles: [
            { title: "Easy Alpine Walk", img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1200&q=80", href: "/things/kalbajar/easy-walk" },
            { title: "Panorama Trail", img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80", href: "/things/kalbajar/panorama-trail" }
          ]
        }
      },

      {
        slug: "drives",
        title: "Scenic mountain drives",
        teaser: "Road trips through high terrain.",
        img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
        panel: {
          headline: "Highland routes",
          body:
            "Plan a driving route across passes, valleys, and lake areas for a full scenic day.",
          ctaText: "See drive ideas",
          ctaHref: "/things/kalbajar/drives",
          tiles: [
            { title: "Pass Route", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", href: "/things/kalbajar/pass-route" },
            { title: "Lake Loop", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", href: "/things/kalbajar/lake-loop" }
          ]
        }
      }
    ]
  },

  faq: [
    {
      q: "How long should I spend in Kalbajar?",
      a: "Most visitors spend at least one full day, while nature-focused travelers often stay longer."
    },
    {
      q: "Is Kalbajar good for hiking?",
      a: "Yes. It’s one of the best hiking regions in Karabakh, with routes ranging from easy walks to longer ridge trails."
    },
    {
      q: "What makes Kalbajar unique?",
      a: "Its alpine scale, natural mineral springs, and mountain lakes make it the region’s strongest nature destination."
    },
    {
      q: "Is it suitable for photography?",
      a: "Yes. Lakes, ridges, clouds, and dramatic light conditions create excellent landscape photography opportunities."
    },
    {
      q: "Can I combine it with other places?",
      a: "Yes. Many travelers pair Kalbajar with Lachin or Aghdere for a full nature-focused route."
    },
    {
      q: "Is it suitable for a short stop?",
      a: "It can be, but the region is best enjoyed with more time due to distances and scenic depth."
    }
  ],

  plan: [
    {
      h: "Getting there",
      p: "Check road conditions and timing—mountain routes may take longer than expected.",
    },
    {
      h: "Where to stay",
      p: "Plan accommodation ahead or use nearby bases depending on your itinerary.",
    },
    {
      h: "What to pack",
      p: "Layered clothing, good walking shoes, and water are essential due to altitude and terrain.",
    },
  ],

  related: [
    { slug: "lachin", name: "Lachin", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", desc: "Mountains, trails, and highland scenery." },
    { slug: "aghdere", name: "Aghdere", img: "https://azertag.az/files/2026/1/1200x630/17692457786396059587_1200x630.jpg?v=697836100498d", desc: "Forests, rivers, and calm nature." },
    { slug: "shusha", name: "Shusha", img: "https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg", desc: "Culture, music heritage, and viewpoints." },
    { slug: "agdam", name: "Aghdam", img: "https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg", desc: "Memorial routes and revival spaces." },
    { slug: "fuzuli", name: "Fuzuli", img: "https://admin.aztv.az//userfiles/old/news/2024/10/15/1071815.jpg", desc: "Gateway city and transport connections." },
    { slug: "khankendi", name: "Khankendi", img: "https://www.azernews.az/media/2023/08/03/eko7spowaaah2rq.jpg", desc: "Urban life and dining spots." },
  ],
},



};

export default cities;