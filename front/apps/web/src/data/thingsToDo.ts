// data/thingsToDo.data.js
const thingsToDo = {
  pages: {
    attractions: {
      hero: {
        title: "Attractions",
        subtitle: "Landmarks, viewpoints, museums and iconic stops across Karabakh.",
        image: "https://azerbaijan.travel/resize3000/center/pages/256/9d4ac18f-b356-445f-a87c-bf4c7742a407.jpg"
      },

      // 2–3 dropdown filters
      filters: {
        city: {
          label: "City",
          options: [
            { value: "all", label: "All cities" },
            { value: "shusha", label: "Shusha" },
            { value: "khankendi", label: "Khankendi" },
            { value: "agdam", label: "Aghdam" },
            { value: "lachin", label: "Lachin" },
            { value: "kalbajar", label: "Kalbajar" },
            { value: "fuzuli", label: "Fuzuli" },
            { value: "aghdere", label: "Aghdere" }
          ]
        },
        category: {
          label: "Type",
          options: [
            { value: "all", label: "All types" },
            { value: "heritage", label: "Heritage" },
            { value: "nature", label: "Nature" },
            { value: "museum", label: "Museums" },
            { value: "viewpoint", label: "Viewpoints" }
          ]
        },
        price: {
          label: "Budget",
          options: [
            { value: "all", label: "Any" },
            { value: "free", label: "Free" },
            { value: "paid", label: "Paid" }
          ]
        }
      },

      sort: {
        label: "Sort",
        default: "recommended",
        options: [
          { value: "recommended", label: "Recommended" },
          { value: "rating_desc", label: "Top rated" },
          { value: "name_asc", label: "Name (A–Z)" }
        ]
      },

      // Cards data
      items: [
        {
          id: "att_shu_quarter",
          name: "Shusha Historical Quarter",
          desc: "Walk restored streets, terraces and cultural landmarks in the region’s symbolic cultural capital.",
          image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
          href: "/attractions/shusha-historical-quarter",
          city: "shusha",
          category: "heritage",
          priceTier: "paid",
          priceOrder: 2,
          rating: 4.8,
          duration: "1–2 hours",
          tags: ["culture", "walking"]
        },
        {
          id: "att_agd_mosque",
          name: "Aghdam Mosque Area",
          desc: "A key landmark and starting point for understanding Aghdam’s memorial and revival story.",
          image: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1400&q=80",
          href: "/attractions/agdam-mosque",
          city: "agdam",
          category: "heritage",
          priceTier: "free",
          priceOrder: 1,
          rating: 4.5,
          duration: "45–90 min",
          tags: ["history", "landmark"]
        },
        {
          id: "att_kal_views",
          name: "Kalbajar Alpine Viewpoints",
          desc: "High-elevation panoramas with dramatic ridgelines and shifting light for photography.",
          image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80",
          href: "/attractions/kalbajar-viewpoints",
          city: "kalbajar",
          category: "viewpoint",
          priceTier: "free",
          priceOrder: 1,
          rating: 4.7,
          duration: "30–60 min",
          tags: ["nature", "photo"]
        }
      ]
    },

    restaurants: {
      hero: {
        title: "Restaurants",
        subtitle: "Local dining spots, cafés and regional tastes—find your next meal.",
        image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1800&q=80"
      },

      filters: {
        city: {
          label: "City",
          options: [
            { value: "all", label: "All cities" },
            { value: "khankendi", label: "Khankendi" },
            { value: "shusha", label: "Shusha" },
            { value: "agdam", label: "Aghdam" }
          ]
        },
        category: {
          label: "Cuisine",
          options: [
            { value: "all", label: "All cuisines" },
            { value: "azerbaijani", label: "Azerbaijani" },
            { value: "cafe", label: "Café" },
            { value: "grill", label: "Grill" }
          ]
        },
        price: {
          label: "Price",
          options: [
            { value: "all", label: "Any" },
            { value: "$", label: "$" },
            { value: "$$", label: "$$" },
            { value: "$$$", label: "$$$" }
          ]
        }
      },

      sort: {
        label: "Sort",
        default: "recommended",
        options: [
          { value: "recommended", label: "Recommended" },
          { value: "rating_desc", label: "Top rated" },
          { value: "price_asc", label: "Price (low → high)" },
          { value: "price_desc", label: "Price (high → low)" },
          { value: "name_asc", label: "Name (A–Z)" }
        ]
      },

      items: [
        {
          id: "res_khk_cafe",
          name: "Central Café (Khankendi)",
          desc: "A relaxed café stop for coffee breaks, light meals, and a city-walk pause.",
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
          href: "/restaurants/khankendi-central-cafe",
          city: "khankendi",
          category: "cafe",
          priceTier: "$$",
          priceOrder: 2,
          rating: 4.6,
          hours: "10:00–22:00",
          tags: ["coffee", "casual"]
        },
        {
          id: "res_shu_local",
          name: "Shusha Local Table",
          desc: "Traditional dishes and a classic hospitality-style table setting.",
          image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80",
          href: "/restaurants/shusha-local-table",
          city: "shusha",
          category: "azerbaijani",
          priceTier: "$$$",
          priceOrder: 3,
          rating: 4.7,
          hours: "12:00–23:00",
          tags: ["local", "dinner"]
        }
      ]
    },

    tours: {
      hero: {
        title: "Tours",
        subtitle: "Curated routes—culture, nature, city discovery and day trips.",
        image: "https://images.pexels.com/photos/7263352/pexels-photo-7263352.jpeg"
      },

      filters: {
        city: {
          label: "Start city",
          options: [
            { value: "all", label: "Any start city" },
            { value: "fuzuli", label: "Fuzuli" },
            { value: "khankendi", label: "Khankendi" },
            { value: "shusha", label: "Shusha" }
          ]
        },
        category: {
          label: "Theme",
          options: [
            { value: "all", label: "All themes" },
            { value: "culture", label: "Culture" },
            { value: "nature", label: "Nature" },
            { value: "daytrip", label: "Day trip" }
          ]
        },
        price: {
          label: "Group type",
          options: [
            { value: "all", label: "Any" },
            { value: "group", label: "Group" },
            { value: "private", label: "Private" }
          ]
        }
      },

      sort: {
        label: "Sort",
        default: "recommended",
        options: [
          { value: "recommended", label: "Recommended" },
          { value: "rating_desc", label: "Top rated" },
          { value: "name_asc", label: "Name (A–Z)" }
        ]
      },

      items: [
        {
          id: "tour_shu_culture",
          name: "Shusha Culture Walk",
          desc: "A guided route through key streets, viewpoints, and cultural landmarks.",
          image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
          href: "/tours/shusha-culture-walk",
          city: "shusha",
          category: "culture",
          priceTier: "group",
          priceOrder: 1,
          rating: 4.8,
          duration: "3–4 hours",
          tags: ["guide", "walking"]
        },
        {
          id: "tour_kal_nature",
          name: "Kalbajar Alpine Day Trip",
          desc: "Scenic drives, viewpoints and nature stops in a highland route.",
          image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80",
          href: "/tours/kalbajar-alpine-day-trip",
          city: "kalbajar",
          category: "nature",
          priceTier: "private",
          priceOrder: 2,
          rating: 4.7,
          duration: "Full day",
          tags: ["scenic", "photo"]
        }
      ]
    },

    wellness: {
      hero: {
        title: "Wellness",
        subtitle: "Springs, calm escapes and relaxation routes for slow travel.",
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=80"
      },

      filters: {
        city: {
          label: "Area",
          options: [
            { value: "all", label: "Any area" },
            { value: "kalbajar", label: "Kalbajar" },
            { value: "lachin", label: "Lachin" },
            { value: "aghdere", label: "Aghdere" }
          ]
        },
        category: {
          label: "Wellness type",
          options: [
            { value: "all", label: "All types" },
            { value: "springs", label: "Mineral springs" },
            { value: "spa", label: "Spa" },
            { value: "retreat", label: "Retreat" }
          ]
        },
        price: {
          label: "Cost",
          options: [
            { value: "all", label: "Any" },
            { value: "free", label: "Free" },
            { value: "paid", label: "Paid" }
          ]
        }
      },

      sort: {
        label: "Sort",
        default: "recommended",
        options: [
          { value: "recommended", label: "Recommended" },
          { value: "rating_desc", label: "Top rated" },
          { value: "name_asc", label: "Name (A–Z)" }
        ]
      },

      items: [
        {
          id: "well_kal_springs",
          name: "Kalbajar Mineral Springs Stop",
          desc: "A natural spring area linked to long-standing wellness traditions in highland landscapes.",
          image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
          href: "/attractions/kalbajar-springs",
          city: "kalbajar",
          category: "springs",
          priceTier: "paid",
          priceOrder: 2,
          rating: 4.6,
          duration: "1–2 hours",
          tags: ["nature", "relax"]
        },
        {
          id: "well_aghdere_escape",
          name: "Aghdere Calm Nature Escape",
          desc: "Forest-and-river atmosphere for a quiet reset and slow travel break.",
          image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
          href: "/attractions/aghdere-escape",
          city: "aghdere",
          category: "retreat",
          priceTier: "free",
          priceOrder: 1,
          rating: 4.5,
          duration: "Half day",
          tags: ["quiet", "fresh-air"]
        }
      ]
    }
  }
};

export default thingsToDo;