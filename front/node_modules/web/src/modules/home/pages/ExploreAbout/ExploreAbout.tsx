import { useEffect } from 'react';

interface AboutData {
    hero?: {
        mediaType?: 'video' | 'img';
        mediaSrc?: string;
        title?: string;
        subtitle?: string;
    };
    mapCard?: { href: string; thumb: string; title: string; desc: string };
    longRead?: {
        image?: string;
        title?: string;
        lead?: string;
        intro?: string[];
        timelineTitle?: string;
        timelineSubtitle?: string;
        timeline?: Array<{ year: string; text: string; img: string }>;
        moreTitle?: string;
        more?: string[];
        qa?: Array<{ q: string; a: string }>;
    };
    categories?: {
        title?: string;
        subtitle?: string;
        items?: Array<{ href: string; img?: string; badge?: string; title: string; desc: string }>;
        cta?: { href: string; text: string };
    };
    signature?: { title?: string; subtitle?: string; items?: Array<{ href: string; img: string; title: string; desc: string }> };
    culture?: { title?: string; subtitle?: string; items?: Array<{ href: string; img: string; title: string; desc: string }> };
    nature?: { title?: string; subtitle?: string; items?: Array<{ href: string; img: string; title: string; desc: string }> };
}

interface ExploreAboutProps {
    about: AboutData;
}

// TODO: about datasını API/static data-dan əldə edin.
export default function ExploreAbout({ about }: ExploreAboutProps) {

    // ─── Carousel & Timeline Logic (useEffect) ────────────────────────────────
    useEffect(() => {
        // Carousel
        const track = document.querySelector<HTMLElement>('[data-car-track]');
        const prev = document.querySelector<HTMLElement>('[data-car-prev]');
        const next = document.querySelector<HTMLElement>('[data-car-next]');

        if (track && prev && next) {
            const step = () => Math.min(420, Math.max(260, track.clientWidth * 0.45));
            const onPrev = () => track.scrollBy({ left: -step(), behavior: 'smooth' });
            const onNext = () => track.scrollBy({ left: step(), behavior: 'smooth' });
            prev.addEventListener('click', onPrev);
            next.addEventListener('click', onNext);
        }

        // Timeline
        const root = document.querySelector<HTMLElement>('[data-kb-timeline]');
        if (!root) return;

        const items = about.longRead?.timeline || [];
        if (!items.length) return;

        const imgEl = root.querySelector<HTMLImageElement>('[data-kb-media]');
        const yearEl = root.querySelector<HTMLElement>('[data-kb-year]');
        const textEl = root.querySelector<HTMLElement>('[data-kb-text]');
        const yearBtns = [...root.querySelectorAll<HTMLElement>('.kbYear')];
        let idx = 0;

        function render(i: number) {
            idx = (i + items.length) % items.length;
            const t = items[idx];
            if (imgEl) imgEl.src = t.img;
            if (yearEl) yearEl.textContent = t.year;
            if (textEl) textEl.textContent = t.text;
            yearBtns.forEach((b, k) => b.classList.toggle('is-active', k === idx));
        }

        const prevBtn = root.querySelector<HTMLElement>('[data-kb-prev]');
        const nextBtn = root.querySelector<HTMLElement>('[data-kb-next]');
        if (prevBtn) prevBtn.addEventListener('click', () => render(idx - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => render(idx + 1));
        yearBtns.forEach(b => {
            b.addEventListener('click', () => render(+(b.dataset.kbIdx ?? 0)));
        });
        render(0);
    }, [about]);

    return (
        <main>
            {/* HERO */}
            <section className="aboutHero" id="top">
                <div className="container">
                    <div className="aboutHero__card">
                        <div className="aboutHero__media" aria-hidden="true">
                            {about.hero?.mediaType === 'video'
                                ? <video src={about.hero.mediaSrc} autoPlay muted loop playsInline></video>
                                : <img src={about.hero?.mediaSrc} alt="" />
                            }
                        </div>
                        <div className="aboutHero__shade" aria-hidden="true"></div>
                        <div className="aboutHero__vignette" aria-hidden="true"></div>
                        <div className="aboutHero__content">
                            <h1 className="aboutHero__title">{about.hero?.title}</h1>
                            <p className="aboutHero__sub">{about.hero?.subtitle}</p>
                            <div className="aboutHero__actions">
                                <a className="heroBtn heroBtn--primary" href="/explore/articles">
                                    Learn more <span className="heroArrow" aria-hidden="true">›</span>
                                </a>
                                <a className="heroBtn heroBtn--ghost" href="/things-to-do/restaurants">
                                    Explore dining options <span className="heroArrow" aria-hidden="true">›</span>
                                </a>
                            </div>
                        </div>
                        <div className="aboutHero__bottom">
                            {about.mapCard && (
                                <a className="mapThumb" href={about.mapCard.href}>
                                    <div className="mapThumb__img"><img src={about.mapCard.thumb} alt="" /></div>
                                    <div className="mapThumb__b">
                                        <div className="mapThumb__t">{about.mapCard.title}</div>
                                        <div className="mapThumb__d">{about.mapCard.desc}</div>
                                        <div className="mapThumb__cta">Open map <span aria-hidden="true">›</span></div>
                                    </div>
                                </a>
                            )}
                        </div>
                        <div className="aboutHero__dots" aria-hidden="true">
                            <span className="dot is-active"></span><span className="dot"></span><span className="dot"></span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Long Read */}
            <section className="kbAboutLong" id="about-long">
                <div className="container">
                    <div className="kbIntro">
                        <div className="kbIntro__media"><img src={about.longRead?.image} alt="" /></div>
                        <div className="kbIntro__content">
                            <header className="kbAboutLong__head">
                                <h2 className="kbAboutLong__title">{about.longRead?.title}</h2>
                                <p className="kbAboutLong__lead">{about.longRead?.lead}</p>
                            </header>
                            <div className="kbAboutLong__intro">
                                {(about.longRead?.intro || []).map((p, i) => <p key={i}>{p}</p>)}
                            </div>
                        </div>
                    </div>

                    <div className="kbTimeline" data-kb-timeline>
                        <div className="kbTimeline__top">
                            <h3 className="kbTimeline__h">{about.longRead?.timelineTitle}</h3>
                            <p className="kbTimeline__sub">{about.longRead?.timelineSubtitle}</p>
                        </div>
                        <div className="kbTimeline__stage">
                            <div className="kbTimeline__media">
                                <img data-kb-media src={about.longRead?.timeline?.[0]?.img} alt="" />
                            </div>
                            <div className="kbTimeline__copy">
                                <div className="kbTimeline__year" data-kb-year>{about.longRead?.timeline?.[0]?.year}</div>
                                <div className="kbTimeline__text" data-kb-text>{about.longRead?.timeline?.[0]?.text}</div>
                            </div>
                        </div>
                        <div className="kbTimeline__bar">
                            <button className="kbTLBtn" type="button" data-kb-prev aria-label="Previous">‹</button>
                            <div className="kbTLYears" data-kb-years>
                                {(about.longRead?.timeline || []).map((t, idx) => (
                                    <button key={idx} className="kbYear" type="button" data-kb-idx={idx}>{t.year}</button>
                                ))}
                            </div>
                            <button className="kbTLBtn" type="button" data-kb-next aria-label="Next">›</button>
                        </div>
                        <div className="kbTimeline__hint">Select a milestone to explore Karabakh's story.</div>
                    </div>

                    <div className="kbFacts">
                        <h3 className="kbFacts__h">{about.longRead?.moreTitle}</h3>
                        <ul className="kbFacts__list">
                            {(about.longRead?.more || []).map((x, i) => <li key={i}>{x}</li>)}
                        </ul>
                    </div>

                    <div className="kbQA">
                        {(about.longRead?.qa || []).map((b, i) => (
                            <article key={i} className="kbQACard">
                                <h3 className="kbQACard__h">{b.q}</h3>
                                <p className="kbQACard__p">{b.a}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHAT YOU'LL FIND */}
            <section className="aboutCats" id="find">
                <div className="container">
                    <header className="aboutCats__head">
                        <h2 className="aboutCats__title">{about.categories?.title}</h2>
                        <p className="aboutCats__sub">{about.categories?.subtitle}</p>
                    </header>
                    <div className="aboutCats__grid">
                        {(about.categories?.items || []).map((item, i) => (
                            <a key={i} className="aboutCat" href={item.href}>
                                {item.img && (
                                    <div className="aboutCat__media" aria-hidden="true">
                                        <img src={item.img} alt="" />
                                        <span className="aboutCat__shade" aria-hidden="true"></span>
                                    </div>
                                )}
                                <div className="aboutCat__body">
                                    <div className="aboutCat__top">
                                        {item.badge && <span className="aboutCat__badge">{item.badge}</span>}
                                    </div>
                                    <h3 className="aboutCat__t">{item.title}</h3>
                                    <p className="aboutCat__d">{item.desc}</p>
                                    <div className="aboutCat__cta">Explore <span aria-hidden="true">›</span></div>
                                </div>
                            </a>
                        ))}
                    </div>
                    {about.categories?.cta && (
                        <div className="aboutCats__foot">
                            <a className="aboutCats__all" href={about.categories.cta.href}>
                                {about.categories.cta.text} <span aria-hidden="true">›</span>
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* SIGNATURE PLACES (carousel) */}
            <section className="aboutCarousel" id="signature">
                <div className="container">
                    <header className="secHead secHead--row">
                        <div>
                            <h2>{about.signature?.title}</h2>
                            <p>{about.signature?.subtitle}</p>
                        </div>
                    </header>
                    <div className="carFrame">
                        <button className="carArrow carArrow--prev" type="button" data-car-prev aria-label="Previous">‹</button>
                        <div className="carTrack" data-car-track>
                            {(about.signature?.items || []).map((it, i) => (
                                <a key={i} className="carCard" href={it.href}>
                                    <div className="carCard__img"><img src={it.img} alt="" /></div>
                                    <div className="carCard__b">
                                        <div className="carCard__meta">ATTRACTION</div>
                                        <div className="carCard__t">{it.title}</div>
                                        <div className="carCard__d">{it.desc}</div>
                                        <div className="carCard__cta">Discover more <span aria-hidden="true">›</span></div>
                                    </div>
                                </a>
                            ))}
                        </div>
                        <button className="carArrow carArrow--next" type="button" data-car-next aria-label="Next">›</button>
                    </div>
                </div>
            </section>

            {/* CULTURE SNAPSHOT */}
            <section className="snap">
                <div className="container">
                    <header className="secHead"><h2>{about.culture?.title}</h2><p>{about.culture?.subtitle}</p></header>
                    <div className="snapGrid">
                        {(about.culture?.items || []).map((it, i) => (
                            <a key={i} className="snapCard" href={it.href}>
                                <div className="snapCard__img"><img src={it.img} alt="" /></div>
                                <div className="snapCard__b"><div className="snapCard__t">{it.title}</div><div className="snapCard__d">{it.desc}</div></div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* NATURE SNAPSHOT */}
            <section className="snap">
                <div className="container">
                    <header className="secHead"><h2>{about.nature?.title}</h2><p>{about.nature?.subtitle}</p></header>
                    <div className="snapGrid">
                        {(about.nature?.items || []).map((it, i) => (
                            <a key={i} className="snapCard" href={it.href}>
                                <div className="snapCard__img"><img src={it.img} alt="" /></div>
                                <div className="snapCard__b"><div className="snapCard__t">{it.title}</div><div className="snapCard__d">{it.desc}</div></div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="ctaSplit" id="city-pass">
                <div className="container">
                    <div className="ctaSplit__card">
                        <div className="ctaSplit__media" aria-hidden="true"></div>
                        <div className="ctaSplit__content">
                            <div className="ctaSplit__badge">Karabakh City Pass</div>
                            <h3 className="ctaSplit__title">Save more on the best experiences</h3>
                            <p className="ctaSplit__text">
                                Bundle attractions, tours, and transport in one pass. Pick your plan, build your itinerary,
                                and unlock priority perks across Karabakh.
                            </p>
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
