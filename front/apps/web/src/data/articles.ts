// data/articles.js
// 5 article objects + helpers for routing/rendering.
// Keep it stable: page templates can rely on these fields.

const articles = [
  {
    slug: "karabakh-living-traditions",
    category: "Culture",
    city: "Karabakh",
    readTime: "6 min read",
    published: "2026-02-18",
    title: "Karabakh: Land of living traditions",
    excerpt:
      "Discover music, poetry, crafts and culinary heritage shaping the identity of the region.",
    coverImg:
      "https://azerbaijan.travel/resize3000/center/pages/9266/cea6de31-5e8c-49a9-b06b-12e1e4977fd8.png",

    hero: {
      kicker: "Discover Karabakh",
      title: "Land of living traditions",
      subtitle:
        "A practical cultural overview: how music, poetry, craftsmanship, and cuisine connect across the region — and how to experience them without rushing.",
      meta: {
        updated: "2026-02-18",
        location: "Karabakh region",
      },
    },

    tags: ["heritage", "culture", "music", "crafts", "cuisine"],

    // Content blocks for article page
    blocks: [
      {
        type: "lead",
        text:
          "Karabakh is often described through mountains and valleys, but its identity is equally shaped by living culture — performance traditions, poetic memory, craftsmanship, and the everyday hospitality that turns a visit into a shared rhythm.",
      },
      {
        type: "section",
        id: "music",
        h: "Music heritage you can actually feel",
        p: [
          "In Karabakh, music isn’t only a concert — it’s a cultural language. The best way to experience it is through small, curated stops: museums, heritage streets, and venues where local stories connect the past with the present.",
          "If you only have half a day, pair one cultural stop with a slow walking route. That combination gives context, not just photos.",
        ],
        bullets: [
          "Choose 1 main music-related stop (museum / heritage site).",
          "Add 1 walkable street or viewpoint route nearby.",
          "End with a calm café/meal stop to slow the pace.",
        ],
      },
      {
        type: "section",
        id: "poetry",
        h: "Poetry and storytelling: how to visit without it feeling abstract",
        p: [
          "Poetry and storytelling in the region are best approached as place-based context. Look for interpretive routes, local guides, or curated exhibits where names become human stories connected to streets, houses, and public spaces.",
          "If your itinerary is tight, treat poetry as a layer: 20–30 minutes at a good exhibit beats trying to cover everything.",
        ],
      },
      {
        type: "section",
        id: "crafts",
        h: "Craft traditions: what to look for",
        p: [
          "Craft heritage is often visible in patterns, materials, and techniques. Rather than hunting for a ‘perfect’ souvenir, focus on understanding motifs and workmanship — then buying becomes meaningful.",
        ],
        bullets: [
          "Ask about motif meaning (floral, geometric, local symbols).",
          "Check material and finish quality (edges, density, consistency).",
          "Prefer fewer items with clearer provenance over many random items.",
        ],
      },
      {
        type: "callout",
        title: "A simple 3-hour culture mini-plan",
        text:
          "1) 60–75 min: cultural stop (museum / heritage). 2) 60 min: slow walk route. 3) 60 min: meal + reflection. This rhythm prevents ‘checking boxes’ and makes the visit feel real.",
      },
      {
        type: "section",
        id: "food",
        h: "Cuisine and hospitality: the easiest way to connect",
        p: [
          "Food is the most direct cultural bridge. Build your day so you arrive hungry — then give yourself time. A rushed meal becomes just calories; a slow meal becomes context.",
          "If you’re traveling with family, this is also the most universal experience: everyone remembers the table.",
        ],
      },
      {
        type: "checklist",
        title: "Before you go",
        items: [
          "Pick 1 cultural anchor stop (museum / heritage site).",
          "Plan 1 walk route with minimal transport switching.",
          "Leave 60–90 minutes for food — don’t compress it.",
          "Carry a light layer: evenings and viewpoints can be cooler.",
        ],
      },
    ],

    related: [
      { slug: "shusha-music-heritage-route", title: "Shusha’s music heritage: a walkable route" },
      { slug: "karabakh-carpet-motifs-guide", title: "Carpet motifs of Karabakh: what to look for" },
    ],
  },

  {
    slug: "shusha-music-heritage-route",
    category: "Culture",
    city: "Shusha",
    readTime: "7 min read",
    published: "2026-02-02",
    title: "Shusha’s music heritage: a walkable route",
    excerpt:
      "A slow, practical route that connects heritage streets, cultural stops, and viewpoints — without overplanning.",
    coverImg:
      "https://www.virtualkarabakh.az/sekiller/c6aacf12846594e1512676702.jpg",

    hero: {
      kicker: "Shusha guide",
      title: "Music heritage, step by step",
      subtitle:
        "A walk-first route designed for real travel: short distances, meaningful stops, and time for atmosphere.",
      meta: { updated: "2026-02-02", location: "Shusha" },
    },

    tags: ["shusha", "music", "walking route", "culture"],

    blocks: [
      {
        type: "lead",
        text:
          "Shusha works best on foot. Instead of trying to ‘see everything’, use a simple loop: one cultural anchor, one heritage street zone, one viewpoint, and one calm break.",
      },
      {
        type: "section",
        id: "route",
        h: "The 4-stop loop (2.5–4 hours)",
        p: [
          "This route is designed to avoid zig-zagging. Keep the day light: you’re here for atmosphere, not a checklist.",
        ],
        bullets: [
          "Stop 1 — Cultural anchor: museum / curated heritage point (60–75 min).",
          "Stop 2 — Heritage streets: slow walk, take photos, notice details (45–60 min).",
          "Stop 3 — Viewpoint: wide panorama, golden-hour if possible (30–45 min).",
          "Stop 4 — Break: café/meal + reflection time (45–90 min).",
        ],
      },
      {
        type: "section",
        id: "pace",
        h: "How to keep the pace right",
        p: [
          "The most common mistake in Shusha is moving too fast. If you want the city to ‘land’, you need pauses.",
          "Treat viewpoints and cafés as part of the cultural experience — not just rest stops.",
        ],
      },
      {
        type: "callout",
        title: "If you only have 90 minutes",
        text:
          "Do 1 cultural anchor (45–60 min) + 1 short heritage street walk (30 min). Skip driving around — walking gives more value per minute.",
      },
      {
        type: "checklist",
        title: "What to pack for Shusha walking",
        items: [
          "Comfortable shoes (stone paths + slopes).",
          "Light jacket for evening wind at viewpoints.",
          "Water (especially if you walk during midday).",
          "Phone battery/power bank (photos + maps).",
        ],
      },
    ],

    related: [
      { slug: "karabakh-living-traditions", title: "Karabakh: Land of living traditions" },
      { slug: "weekend-route-shusha-lachin", title: "Weekend route: Shusha + Lachin" },
    ],
  },

  {
    slug: "karabakh-carpet-motifs-guide",
    category: "Culture",
    city: "Karabakh",
    readTime: "8 min read",
    published: "2026-01-20",
    title: "Carpet motifs of Karabakh: what to look for",
    excerpt:
      "A buyer-friendly guide to understanding motifs, materials, and craftsmanship — even if you’re not an expert.",
    coverImg:
      "https://www.virtualkarabakh.az/sekiller/2c5a5a318c2da231521985363.jpg",

    hero: {
      kicker: "Craft guide",
      title: "Motifs, meaning, workmanship",
      subtitle:
        "You don’t need to be a specialist. Use a simple checklist: pattern clarity, density, edges, and story.",
      meta: { updated: "2026-01-20", location: "Karabakh region" },
    },

    tags: ["carpets", "motifs", "crafts", "shopping"],

    blocks: [
      {
        type: "lead",
        text:
          "Carpets carry identity through motif, technique, and color logic. If you understand a few basics, you’ll see the difference between decoration and craftsmanship.",
      },
      {
        type: "section",
        id: "motifs",
        h: "How to read a motif (without overthinking)",
        p: [
          "Motifs usually function as visual language: symmetry, repetition, and focal elements. Don’t try to memorize names — focus on structure and intention.",
        ],
        bullets: [
          "Central focal element: what the eye returns to.",
          "Border logic: how the edges ‘frame’ the story.",
          "Repetition rhythm: consistent spacing, clean geometry.",
        ],
      },
      {
        type: "section",
        id: "quality",
        h: "Quality checklist you can use in 60 seconds",
        p: ["Use these fast checks before you look at price:"],
        bullets: [
          "Edges: straight, finished, not rough or uneven.",
          "Pattern clarity: lines don’t ‘bleed’ into each other.",
          "Density/feel: consistent surface — not patchy.",
          "Back side: pattern should be readable, not blurry.",
        ],
      },
      {
        type: "callout",
        title: "A smart buying rule",
        text:
          "Prefer one item with clear workmanship and provenance over multiple items chosen only by color. You’ll value it longer.",
      },
      {
        type: "section",
        id: "care",
        h: "Care basics (so it stays beautiful)",
        p: [
          "A good carpet ages well if you keep it clean and dry. Avoid harsh cleaning chemicals. Rotate occasionally if it sits in strong sunlight.",
        ],
      },
      {
        type: "checklist",
        title: "Before purchasing",
        items: [
          "Ask about material (wool/silk blend etc.) and origin story.",
          "Inspect edges + underside pattern clarity.",
          "Confirm size and whether it’s hand-made or machine-made.",
          "Agree on safe transport/packing method.",
        ],
      },
    ],

    related: [
      { slug: "karabakh-living-traditions", title: "Karabakh: Land of living traditions" },
      { slug: "karabakh-food-table-culture", title: "Karabakh table culture: how to plan a food day" },
    ],
  },

  {
    slug: "weekend-route-shusha-lachin",
    category: "Routes",
    city: "Shusha / Lachin",
    readTime: "7 min read",
    published: "2025-10-03",
    title: "Weekend route: Shusha + Lachin",
    excerpt:
      "Combine heritage streets with panoramic mountain viewpoints in two days — realistic pacing, not a checklist.",
    coverImg:
      "https://cdn.yeniavaz.com/uploadedfiles/custom/2020/11/4/1/6926758f-aa18-4ede-9079-3b70c3c1e4c0/susa-lacin-yolu.jpg",

    hero: {
      kicker: "2-day itinerary",
      title: "Shusha + Lachin in one weekend",
      subtitle:
        "Day 1 culture + viewpoints. Day 2 mountain roads + scenic stops. Designed for flow and minimal backtracking.",
      meta: { updated: "2025-10-03", location: "Shusha / Lachin" },
    },

    tags: ["weekend", "itinerary", "routes", "mountains"],

    blocks: [
      {
        type: "lead",
        text:
          "This weekend plan is built around two different energies: Shusha for heritage and atmosphere; Lachin for mountain scale and open air. Keep stops fewer, longer, and calmer.",
      },
      {
        type: "section",
        id: "day1",
        h: "Day 1 — Shusha (culture + golden hour)",
        p: [
          "Shusha delivers value through walking. Don’t spend the day driving between micro-stops. Pick one cultural anchor, walk slowly, then commit to one viewpoint for sunset.",
        ],
        bullets: [
          "Morning: cultural anchor stop (60–90 min).",
          "Midday: heritage street loop (60 min).",
          "Afternoon: meal + slow break (60–90 min).",
          "Evening: viewpoint for golden hour (30–45 min).",
        ],
      },
      {
        type: "section",
        id: "day2",
        h: "Day 2 — Lachin (mountain routes + scenic pauses)",
        p: [
          "Lachin is about roads and wide horizons. Plan 2 viewpoints + 1 short walk. Avoid trying to cover too much geography in one day.",
        ],
        bullets: [
          "Stop 1: high viewpoint (30–45 min).",
          "Stop 2: valley / river-route pause (20–30 min).",
          "Stop 3: short trail / forest-edge walk (45–60 min).",
          "Stop 4: final panorama (30 min).",
        ],
      },
      {
        type: "callout",
        title: "The biggest mistake",
        text:
          "Trying to turn a weekend into a ‘multi-city conquest’. Choose fewer places, spend longer at each. You’ll remember it more clearly.",
      },
      {
        type: "checklist",
        title: "Packing list (weekend basics)",
        items: [
          "Walking shoes (stone streets + uneven ground).",
          "Layers (mountain weather changes fast).",
          "Water + light snacks for scenic routes.",
          "Power bank (photos drain battery quickly).",
        ],
      },
    ],

    related: [
      { slug: "shusha-music-heritage-route", title: "Shusha’s music heritage: a walkable route" },
      { slug: "lachin-mountain-day-planner", title: "Lachin mountain day planner: viewpoints + trails" },
    ],
  },

  {
    slug: "lachin-mountain-day-planner",
    category: "Nature",
    city: "Lachin",
    readTime: "5 min read",
    published: "2026-01-29",
    title: "Lachin mountain day planner: viewpoints + trails",
    excerpt:
      "A practical day plan for scenic routes in Lachin — simple structure, flexible timing.",
    coverImg:
      "https://c.files.bbci.co.uk/A479/production/_115750124_screenshot2020-12-01at09.09.44.png",

    hero: {
      kicker: "Nature planning",
      title: "Lachin: a calm mountain day",
      subtitle:
        "Plan your day like a loop: one high viewpoint, one shaded corridor, one short walk, one final panorama.",
      meta: { updated: "2026-01-29", location: "Lachin" },
    },

    tags: ["lachin", "mountains", "nature", "routes", "photography"],

    blocks: [
      {
        type: "lead",
        text:
          "Lachin feels best when you don’t fight its scale. Accept that distance is part of the experience — and build your day around 3–4 strong stops instead of ten weak ones.",
      },
      {
        type: "section",
        id: "loop",
        h: "The loop structure (works in any season)",
        p: ["Use this order to keep the day smooth:"],
        bullets: [
          "1) High viewpoint first (cleanest light, best visibility).",
          "2) Forest/valley corridor mid-day (shade, slower pace).",
          "3) Short walk (45–60 min) to reset attention.",
          "4) Final panorama for late afternoon / golden hour.",
        ],
      },
      {
        type: "section",
        id: "photo",
        h: "Photography tips that actually help",
        p: [
          "Wide landscapes work best when you add a foreground element: a road curve, a tree line, or a rock edge. Don’t only shoot the horizon.",
        ],
        bullets: [
          "Use foreground framing (road/trees/rocks).",
          "Shoot in bursts at golden hour (light changes fast).",
          "Keep your lens clean — dust shows up strongly in sky shots.",
        ],
      },
      {
        type: "callout",
        title: "If weather changes",
        text:
          "Swap the order: do the walk earlier if clouds are building, then use viewpoints later if visibility returns. The loop stays the same; the timing flexes.",
      },
      {
        type: "checklist",
        title: "Safety + comfort basics",
        items: [
          "Check road conditions before committing to long routes.",
          "Carry water and a light snack (services can be sparse on scenic roads).",
          "Wear layers; higher elevation can be cooler even in mild seasons.",
          "Don’t push hikes late — finish walking before dark if possible.",
        ],
      },
    ],

    related: [
      { slug: "weekend-route-shusha-lachin", title: "Weekend route: Shusha + Lachin" },
      { slug: "karabakh-living-traditions", title: "Karabakh: Land of living traditions" },
    ],
  },
];

// Köhnə funksiyaları və module.exports-u silin, yerinə bunları əlavə edin:
export const getArticleBySlug = (slug: string) => {
  const s = String(slug || "").toLowerCase();
  return articles.find(a => a.slug === s);
};

export const getAllArticles = () => {
  return [...articles].sort((a, b) => String(b.published).localeCompare(String(a.published)));
};

export default articles;