import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// ─── City Data Types ──────────────────────────────────────────────────────────
interface CityData {
    name: string;
    subtitle: string;
    heroImg: string;
    badges?: string[];
    aboutHeroTitle?: string;
    aboutLong?: string[];
    aboutCtaHref?: string;
    aboutCtaText?: string;
    aboutImages?: string[];
    attractionsIntro?: string;
    attractions?: Array<{ title: string; desc: string; img?: string; href?: string }>;
    things?: {
        title?: string;
        subtitle?: string;
        categories?: Array<{
            slug: string; title: string; teaser: string; img: string;
            panel: { headline: string; body: string; ctaText: string; ctaHref: string; tiles: Array<{ href: string; img: string; title: string }> };
        }>;
    };
    faq?: Array<{ q: string; a: string }>;
    related?: Array<{ slug: string; name: string; img: string; desc?: string }>;
}

// ─── Static City Data (MVP) ───────────────────────────────────────────────────
// TODO: Connect to API (services/cityService.ts) to replace this static map.
const cityDataMap: Record<string, CityData> = {
    shusha: {
        name: 'Shusha',
        subtitle: 'Cultural capital of Karabakh — music, poetry, heritage and spectacular cliffside views.',
        heroImg: 'https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg',
        badges: ['Cultural Capital', 'UNESCO Heritage', 'Altitude 1400m'],
        aboutHeroTitle: 'Your Shusha journey starts here',
        aboutLong: [
            'Shusha is historically recognized as the cultural capital of Azerbaijan\'s Karabakh region. Perched at 1,400 meters above sea level on a dramatic limestone plateau, the city offers panoramic views over the surrounding valleys.',
            'Known as the birthplace of Azerbaijani classical music and poetry, Shusha produced legendary figures including composer Uzeyir Hajibeyov, singers Bulbul and Khan Shushinski, and poet Khurshidbanu Natavan.',
            'The city\'s restored old quarter features traditional architecture, historic mosques, mansions, and cultural venues that bring its rich history back to life for visitors.',
        ],
        attractions: [
            { title: 'Shusha Fortress', desc: '18th-century fortress walls overlooking dramatic cliffs — a symbol of Karabakh\'s cultural capital.', img: 'https://shusha.gov.az/storage/app/media/initial/Gala.jpg' },
            { title: 'Govhar Agha Mosque', desc: 'A restored landmark and spiritual center in the heart of Shusha\'s historic quarter.', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/A%C5%9Fa%C4%9F%C4%B1_G%C3%B6vh%C9%99r_a%C4%9Fa_m%C9%99scidi_restavrasiya_i%C5%9Fl%C9%99rind%C9%99n_sonra%2C_2024-c%C3%BC_ild%C9%99.jpg' },
            { title: 'Natavan House', desc: 'Former residence of poet Khurshidbanu Natavan — a window into Shusha\'s literary soul.', img: 'https://shusha.gov.az/storage/app/uploads/public/659/c04/400/659c044004d55024880413.jpg' },
        ],
        faq: [
            { q: 'How do I get to Shusha?', a: 'Shusha is accessible via the Lachin corridor from Baku. Distance from Baku is approximately 380 km. Organized tours and transfer services are available.' },
            { q: 'What is the best time to visit?', a: 'Spring (April–June) and early autumn (September–October) offer the most comfortable weather. Summers can be warm but cooler than lowland areas.' },
            { q: 'Do I need special permission to visit?', a: 'Check the latest entry requirements with official Azerbaijani government sources before your trip.' },
        ],
        related: [
            { slug: 'lachin', name: 'Lachin', img: 'https://qafqazinfo.az/uploads/1606827858/lacinsss.jpg', desc: 'Mountain gateway with scenic routes.' },
            { slug: 'khankendi', name: 'Khankendi', img: 'https://www.azernews.az/media/2023/08/03/eko7spowaaah2rq.jpg', desc: 'Regional urban center.' },
            { slug: 'agdam', name: 'Aghdam', img: 'https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg', desc: 'Historic city and plains gateway.' },
        ],
    },
    lachin: {
        name: 'Lachin',
        subtitle: 'Mountain gateway — dramatic ridges, forest trails and the iconic Hakari valley.',
        heroImg: 'https://qafqazinfo.az/uploads/1606827858/lacinsss.jpg',
        badges: ['Mountain City', 'Nature Corridor'],
        aboutLong: [
            'Lachin serves as the main western gateway into Karabakh, offering breathtaking mountain scenery along the Lachin corridor. The surrounding landscape features dramatic ridges, river valleys, and diverse forest ecosystems.',
        ],
        attractions: [
            { title: 'Lachin Corridor Viewpoints', desc: 'Panoramic pull-offs along the mountain road with spectacular valley views.', img: 'https://qafqazinfo.az/uploads/1606827858/lacinsss.jpg' },
        ],
        faq: [
            { q: 'What nature activities are available in Lachin?', a: 'Lachin offers hiking trails, scenic drives, mountain photography spots, and access to highland villages.' },
        ],
        related: [
            { slug: 'shusha', name: 'Shusha', img: 'https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg' },
            { slug: 'kalbajar', name: 'Kalbajar', img: 'https://www.qanunla.az/public/storage/2023/11/media-16046-1606287750-oe178xyu90brgnwzihm4.jpg' },
        ],
    },
    khankendi: {
        name: 'Khankendi',
        subtitle: 'Regional center of Karabakh — urban services, dining and events hub.',
        heroImg: 'https://www.azernews.az/media/2023/08/03/eko7spowaaah2rq.jpg',
        badges: ['Regional Center'],
        aboutLong: ['Khankendi is the main urban center of Karabakh, offering services, dining, and accessibility to the wider region.'],
        faq: [],
        related: [{ slug: 'shusha', name: 'Shusha', img: 'https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg' }],
    },
    agdam: {
        name: 'Aghdam',
        subtitle: 'Historic city on the Karabakh plains — rebuilding, memorial sites, and wide-open landscapes.',
        heroImg: 'https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg',
        badges: ['History & Revival', 'Plains Gateway'],
        aboutLong: ['Aghdam is being rebuilt as a modern city with green infrastructure, while preserving key historic sites including the Aghdam Mosque — a landmark of regional memory.'],
        faq: [],
        related: [{ slug: 'shusha', name: 'Shusha', img: 'https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg' }],
    },
};

// ─── City Page Component ──────────────────────────────────────────────────────
export default function City() {
    const { slug } = useParams<{ slug: string }>();
    const city = cityDataMap[slug ?? ''];

    // ── FAQ & Things-to-Do tabs (useEffect) ──────────────────────────────────
    const cats = city?.things?.categories ?? [];

    useEffect(() => {
        if (!city) return;

        // FAQ Accordion
        const handleFaqClick = (e: MouseEvent) => {
            const btn = (e.target as Element).closest('.faqQ');
            if (!btn) return;
            btn.parentElement?.classList.toggle('is-open');
        };
        document.addEventListener('click', handleFaqClick);

        // Things-to-Do tabs
        const grid = document.querySelector<HTMLElement>('[data-thx-grid]');
        const panel = document.querySelector<HTMLElement>('[data-thx-panel]');
        if (!grid || !panel || !cats.length) {
            return () => document.removeEventListener('click', handleFaqClick);
        }

        const hEl = panel.querySelector<HTMLElement>('[data-thx-h]');
        const pEl = panel.querySelector<HTMLElement>('[data-thx-p]');
        const ctaEl = panel.querySelector<HTMLAnchorElement>('[data-thx-cta]');
        const tilesWrap = panel.querySelector<HTMLElement>('[data-thx-tiles]');
        let openSlug: string | null = null;

        function renderPanel(cat: typeof cats[0]) {
            if (hEl) hEl.textContent = cat.panel.headline || cat.title;
            if (pEl) pEl.textContent = cat.panel.body || '';
            if (ctaEl) { ctaEl.textContent = (cat.panel.ctaText || 'Discover more') + ' ›'; ctaEl.href = cat.panel.ctaHref || '#'; }
            if (tilesWrap) {
                tilesWrap.innerHTML = (cat.panel.tiles || []).slice(0, 2).map(t =>
                    `<a class="thxTile" href="${t.href||'#'}"><span class="thxTile__img"><img src="${t.img}" alt=""></span><span class="thxTile__bar"><span class="thxTile__title">${t.title}</span><span class="thxTile__arrow">›</span></span></a>`
                ).join('');
            }
        }

        const gridClick = (e: MouseEvent) => {
            const btn = (e.target as Element).closest<HTMLElement>('[data-thx-tab]');
            if (!btn) return;
            const s = btn.dataset.thxTab!;
            if (openSlug === s) {
                openSlug = null;
                panel.hidden = true;
                panel.setAttribute('aria-hidden', 'true');
                panel.classList.remove('is-open');
                grid.querySelectorAll('.thxCard').forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-expanded', 'false'); });
            } else {
                const cat = cats.find(x => x.slug === s);
                if (!cat) return;
                openSlug = s;
                grid.querySelectorAll('.thxCard').forEach(b => { const is = (b as HTMLElement).dataset.thxTab === s; b.classList.toggle('is-active', is); b.setAttribute('aria-expanded', is ? 'true' : 'false'); });
                renderPanel(cat);
                panel.hidden = false;
                panel.setAttribute('aria-hidden', 'false');
                panel.classList.add('is-open');
            }
        };

        const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape' && openSlug) { openSlug = null; panel.hidden = true; } };

        grid.addEventListener('click', gridClick);
        document.addEventListener('keydown', escHandler);

        return () => {
            document.removeEventListener('click', handleFaqClick);
            grid.removeEventListener('click', gridClick);
            document.removeEventListener('keydown', escHandler);
        };
    }, [city, cats]);

    // ── Fallback: city not in static map ─────────────────────────────────────
    if (!city) {
        return (
            <main style={{ padding: '120px 24px', textAlign: 'center', minHeight: '60vh' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
                    City data for <em>"{slug}"</em> is coming soon
                </h2>
                <p style={{ opacity: 0.7, marginBottom: '24px' }}>
                    We're building out content for all cities across Karabakh.
                </p>
                <a href="/" style={{ color: 'inherit', textDecoration: 'underline' }}>← Back to home</a>
            </main>
        );
    }

    const aboutLong = city.aboutLong?.length
        ? city.aboutLong
        : ['Add aboutLong paragraphs for this city.'];

    const faq = city.faq ?? [];
    const half = Math.ceil(faq.length / 2);
    const faqLeft = faq.slice(0, half);
    const faqRight = faq.slice(half);

    return (
        <main className="city">
            {/* HERO */}
            <section className="cityHero">
                <div className="container">
                    <div className="cityHero__card">
                        <div className="cityHero__media"><img src={city.heroImg} alt="" /></div>
                        <div className="cityHero__overlay"></div>
                        <div className="cityHero__content">
                            <div className="cityHero__kicker">WHERE TO GO</div>
                            <h1 className="cityHero__title">{city.name}</h1>
                            <p className="cityHero__desc">{city.subtitle}</p>
                            <div className="cityHero__meta">
                                {(city.badges || []).map((b, i) => <span key={i} className="pill">{b}</span>)}
                            </div>
                            <div className="cityHero__actions">
                                <a className="btn btn--primary" href="#highlights">Top highlights</a>
                                <a className="btn btn--ghost" href="#plan">Plan your visit</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="aboutStack" id="about">
                <div className="container aboutStack__grid">
                    <div className="aboutStack__left">
                        <h2 className="aboutStack__title">
                            {city.aboutHeroTitle || `Your ${city.name} journey starts here`}
                        </h2>
                        <div className="aboutStack__text">
                            {aboutLong.map((par, i) => <p key={i}>{par}</p>)}
                        </div>
                        {city.aboutCtaHref && (
                            <a className="aboutStack__cta" href={city.aboutCtaHref}>
                                {city.aboutCtaText || 'Discover more'} <span aria-hidden="true">›</span>
                            </a>
                        )}
                    </div>
                    <div className="aboutStack__right" aria-hidden="true">
                        <div className="aboutStack__img aboutStack__img--back">
                            <img src={city.aboutImages?.[0] || city.heroImg} alt="" />
                        </div>
                        <div className="aboutStack__img aboutStack__img--front">
                            <img src={city.aboutImages?.[1] || city.heroImg} alt="" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Attractions */}
            {city.attractions && city.attractions.length > 0 && (
                <section className="cityAttractions" id="attractions">
                    <div className="container">
                        <header className="cityAttractions__head">
                            <h2 className="cityAttractions__title">What to see in {city.name}</h2>
                            <p className="cityAttractions__lead">
                                {city.attractionsIntro || 'A curated list of landmarks and places worth visiting.'}
                            </p>
                        </header>
                        <div className="cityAttractions__grid">
                            {city.attractions.map((a, i) => (
                                <article key={i} className="attrCard">
                                    {a.img && <div className="attrCard__media"><img src={a.img} alt={a.title} /></div>}
                                    <div className="attrCard__body">
                                        <h3 className="attrCard__title">{a.title}</h3>
                                        <p className="attrCard__desc">{a.desc}</p>
                                        {a.href && <a className="attrCard__cta" href={a.href}>Discover more <span aria-hidden="true">›</span></a>}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Things to do */}
            {cats.length > 0 && (
                <section className="thingsX" id="things">
                    <div className="container">
                        <header className="thingsX__head">
                            <h2 className="thingsX__title">{city.things?.title || `Discover the many sides of ${city.name}`}</h2>
                            <p className="thingsX__sub">{city.things?.subtitle || 'Explore experiences for different travel styles.'}</p>
                        </header>
                        <div className="thingsX__grid" data-thx-grid>
                            {cats.map((c, i) => (
                                <button key={i} className="thxCard" type="button" data-thx-tab={c.slug} aria-expanded="false">
                                    <span className="thxCard__img" style={{ ['--bg' as any]: `url('${c.img}')` }}>
                                        <span className="thxCard__shade" aria-hidden="true"></span>
                                    </span>
                                    <span className="thxCard__text">
                                        <span className="thxCard__h">{c.title}</span>
                                        <span className="thxCard__p">{c.teaser}</span>
                                    </span>
                                    <span className="thxCard__btn" aria-hidden="true">⌄</span>
                                </button>
                            ))}
                        </div>
                        <div className="thxPanel" data-thx-panel hidden aria-hidden="true">
                            <div className="thxPanel__inner">
                                <div className="thxPanel__left">
                                    <div className="thxPanel__kicker">Selected experience</div>
                                    <h3 className="thxPanel__h" data-thx-h></h3>
                                    <p className="thxPanel__p" data-thx-p></p>
                                    <a className="thxPanel__cta" data-thx-cta href="#">Discover more <span aria-hidden="true">›</span></a>
                                </div>
                                <div className="thxPanel__right" data-thx-tiles></div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ */}
            {faq.length > 0 && (
                <section className="cityFaq" id="faq">
                    <div className="container">
                        <header className="cityFaq__head">
                            <h2 className="cityFaq__title">Frequently asked questions about {city.name}</h2>
                            <p className="cityFaq__lead">Practical information to help you plan your visit.</p>
                        </header>
                        <div className="cityFaq__grid">
                            <div className="faqCol">
                                {faqLeft.map((q, i) => (
                                    <div key={i} className="faqItem">
                                        <button className="faqQ"><span>{q.q}</span><span className="faqIcon">+</span></button>
                                        <div className="faqA"><p>{q.a}</p></div>
                                    </div>
                                ))}
                            </div>
                            <div className="faqCol">
                                {faqRight.map((q, i) => (
                                    <div key={i} className="faqItem">
                                        <button className="faqQ"><span>{q.q}</span><span className="faqIcon">+</span></button>
                                        <div className="faqA"><p>{q.a}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Related Cities */}
            {city.related && city.related.length > 0 && (
                <section className="keepExplore" id="keep-exploring">
                    <div className="container">
                        <header className="keepExplore__head">
                            <h2 className="keepExplore__title">Keep exploring</h2>
                            <p className="keepExplore__sub">Pick another city to continue your Karabakh journey.</p>
                        </header>
                        <div className="keepExplore__grid">
                            {city.related.map((c, i) => (
                                <a key={i} className="kxCard" href={`/where/${c.slug}`}>
                                    <div className="kxCard__media"><img src={c.img} alt={c.name} /></div>
                                    <div className="kxCard__body">
                                        <h3 className="kxCard__title">{c.name}</h3>
                                        <p className="kxCard__desc">{c.desc || 'Discover highlights, attractions, and experiences.'}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="ctaSplit" id="city-pass">
                <div className="container">
                    <div className="ctaSplit__card">
                        <div className="ctaSplit__media" aria-hidden="true"></div>
                        <div className="ctaSplit__content">
                            <div className="ctaSplit__badge">Karabakh City Pass</div>
                            <h3 className="ctaSplit__title">Save more on the best experiences</h3>
                            <p className="ctaSplit__text">Bundle attractions, tours, and transport in one pass.</p>
                            <div className="ctaSplit__actions">
                                <a className="ctaSplit__primary" href="#passes">Get the pass</a>
                                <a className="ctaSplit__secondary" href="#how-it-works">How it works</a>
                            </div>
                            <div className="ctaSplit__meta">
                                <span>Flexible tiers</span><span className="dot">•</span>
                                <span>QR entry</span><span className="dot">•</span>
                                <span>Local discounts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
