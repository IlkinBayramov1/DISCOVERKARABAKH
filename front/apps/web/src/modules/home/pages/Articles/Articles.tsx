interface ArticleItem {
    slug: string;
    coverImg: string;
    category: string;
    readTime: string;
    title: string;
    excerpt: string;
    published: string;
}

interface ArticlesProps {
    items?: ArticleItem[];
}

// TODO: items datasını API-dən və ya route loader-dən əldə edin.
export default function Articles({ items = [] }: ArticlesProps) {
    return (
        <main>
            {/* HERO */}
            <section className="aHero">
                <div className="container">
                    <div className="aHero__card">
                        <div className="aHero__media">
                            <img src="https://azerbaijan.travel/resize3000/center/pages/9266/cea6de31-5e8c-49a9-b06b-12e1e4977fd8.png" alt="" />
                        </div>
                        <div className="aHero__shade"></div>
                        <div className="aHero__content">
                            <div className="aHero__k">Discover</div>
                            <h1 className="aHero__t">Articles & Stories</h1>
                            <p className="aHero__s">
                                Guides, inspiration and practical travel insights across Karabakh.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FILTERS */}
            <section className="aControls">
                <div className="container">
                    <div className="aBar">
                        <div className="aBar__group">
                            <label className="aLabel">City</label>
                            <select className="aSelect" defaultValue="All cities">
                                <option>All cities</option>
                                <option>Shusha</option>
                                <option>Khankendi</option>
                                <option>Kalbajar</option>
                                <option>Lachin</option>
                                <option>Aghdam</option>
                                <option>Fuzuli</option>
                            </select>
                        </div>
                        <div className="aBar__group">
                            <label className="aLabel">Category</label>
                            <select className="aSelect" defaultValue="All categories">
                                <option>All categories</option>
                                <option>Culture</option>
                                <option>Nature</option>
                                <option>Routes</option>
                                <option>Food</option>
                                <option>Travel Tips</option>
                            </select>
                        </div>
                        <div className="aBar__group">
                            <label className="aLabel">Date</label>
                            <select className="aSelect" defaultValue="Any time">
                                <option>Any time</option>
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>2026</option>
                                <option>2025</option>
                            </select>
                        </div>
                        <div className="aBar__group aBar__group--grow">
                            <label className="aLabel">Search</label>
                            <input className="aSearch" type="search" placeholder="Search articles…" />
                        </div>
                        <div className="aBar__group">
                            <label className="aLabel">Sort</label>
                            <select className="aSelect" defaultValue="Newest">
                                <option>Newest</option>
                                <option>Oldest</option>
                                <option>Most popular</option>
                            </select>
                        </div>
                        <button className="aBtn">Apply</button>
                    </div>
                </div>
            </section>

            {/* ARTICLES GRID */}
            <section className="aGrid">
                <div className="container">
                    <div className="ttdMeta">
                        <div className="ttdCount"><strong>{items.length}</strong> results</div>
                    </div>
                    <div className="aCards">
                        {items.map((a, index) => (
                            <a key={index} className="aCard" href={`/explore/articles/${a.slug}`}>
                                <div className="aCard__img">
                                    <img src={a.coverImg} alt={a.title} />
                                </div>
                                <div className="aCard__b">
                                    <div className="aCard__top">
                                        <span className="pill pill--soft">{a.category}</span>
                                        <span className="pill pill--rate">{a.readTime}</span>
                                    </div>
                                    <h3 className="aCard__t">{a.title}</h3>
                                    <p className="aCard__d">{a.excerpt}</p>
                                    <div className="aCard__meta">
                                        <span>{a.published}</span>
                                    </div>
                                    <div className="aCard__cta">Read article <span aria-hidden="true">›</span></div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
