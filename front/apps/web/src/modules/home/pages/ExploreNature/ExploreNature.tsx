export default function ExploreNature() {
    return (
        <main>
            {/* HERO */}
            <section className="hero" id="top">
                <div className="container">
                    <div className="heroCard">
                        <div className="heroMedia" aria-hidden="true">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Mount_Kirs.jpg" alt="" />
                        </div>
                        <div className="heroShade" aria-hidden="true"></div>
                        <div className="heroContent">
                            <div className="heroKicker">Nature & landscapes</div>
                            <h1 className="heroTitle">Mountains, Forests & Wild Valleys</h1>
                            <p className="heroSub">
                                From alpine ridges and forest trails to river valleys and mineral springs, Karabakh's nature is shaped by
                                dramatic elevation, seasonal contrast, and wide open routes between regions.
                            </p>
                            <div className="heroCtas">
                                <a className="btn btn--primary" href="#types">Browse nature types <span aria-hidden="true">›</span></a>
                                <a className="btn btn--ghost" href="#spots">Top nature spots <span aria-hidden="true">›</span></a>
                                <a className="btn btn--ghost" href="#routes">Nature routes <span aria-hidden="true">›</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ARTICLE BODY */}
            <section className="article" id="types">
                <div className="container">
                    <header className="articleHead">
                        <h2 className="articleTitle">Start with the landscape type</h2>
                        <p className="articleLead">
                            Choose a nature category to match your travel style—easy viewpoints, forest walks, alpine routes, rivers,
                            or wellness landscapes around mineral springs.
                        </p>
                    </header>

                    {/* NATURE BY TYPE */}
                    <section className="cards">
                        <header className="cardsHead">
                            <h3 className="cardsTitle">Nature by type</h3>
                            <p className="cardsSub">Browse by landscape to plan your next stop.</p>
                        </header>
                        <div className="cardGrid cardGrid--types">
                            {[
                                { href: '/things-to-do/attractions?category=mountains', img: 'https://footontheroad.com/wp-content/uploads/2025/08/nagorno-karabakh.webp', k: 'Popular', t: 'Mountains & ridges', d: 'Alpine views, high passes, and dramatic elevation routes.' },
                                { href: '/things-to-do/attractions?category=forests', img: 'https://files.modern.az/articles/2022/12/24/1671869642_1567507823_meseler.jpg', k: 'Popular', t: 'Forests & trails', d: 'Shaded walks, calm routes, and fresh air stops.' },
                                { href: '/things-to-do/attractions?category=rivers', img: 'https://eu2.contabostorage.com/71933ea89b5a4d0ca528a15679956e5d:azerbaijannews/uploads/img/posts/2022/08/07/hekeri-cayijpg-1659818660.jpg', k: 'Popular', t: 'Rivers & valleys', d: 'Riverbanks, valley panoramas, and scenic drive pull-offs.' },
                                { href: '/things-to-do/wellness?category=springs', img: 'https://fed.az/upload/news/358065.jpg', k: 'Popular', t: 'Mineral springs', d: 'Wellness landscapes and highland spring traditions.' },
                                { href: '/things-to-do/attractions?category=viewpoints', img: 'https://sevinclidunya.wordpress.com/wp-content/uploads/2015/04/95517747.jpg', k: 'Popular', t: 'Viewpoints', d: 'Quick stops for panoramas—ideal for short itineraries.' },
                                { href: '/things-to-do/tours?category=nature', img: 'https://www.virtualkarabakh.az/sekiller/da63108bb0c61515670390.jpg', k: 'Popular', t: 'Guided nature trips', d: 'Local guides, curated routes, and photo-ready stops.' },
                            ].map((card, i) => (
                                <a key={i} className="placeCard placeCard--type" href={card.href}>
                                    <div className="placeCard__img"><img src={card.img} alt="" /></div>
                                    <div className="placeCard__b">
                                        <div className="placeCard__k">{card.k}</div>
                                        <div className="placeCard__t">{card.t}</div>
                                        <div className="placeCard__d">{card.d}</div>
                                        <div className="placeCard__cta">Explore <span aria-hidden="true">›</span></div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* TOP NATURE SPOTS */}
                    <section className="cards" id="spots">
                        <header className="cardsHead">
                            <h3 className="cardsTitle">Top nature spots</h3>
                            <p className="cardsSub">Iconic landscapes and easy starting points for your visit.</p>
                        </header>
                        <div className="cardGrid">
                            {[
                                { href: '/where/kalbajar', img: 'https://www.qanunla.az/public/storage/2023/11/media-16046-1606287750-oe178xyu90brgnwzihm4.jpg', k: 'Highlands', t: 'Kalbajar alpine landscapes', d: 'Wide ridges, open valleys, and dramatic high-altitude routes.' },
                                { href: '/where/lachin', img: 'https://qafqazinfo.az/uploads/1606827858/lacinsss.jpg', k: 'Trails', t: 'Lachin mountain routes', d: 'Scenic roads, ridgelines, and mountain village viewpoints.' },
                                { href: '/where/aghdere', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80', k: 'Forests', t: 'Aghdere forest scenery', d: 'Green corridors, calm routes, and slower nature exploration.' },
                                { href: '/where/agdam', img: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Ka%C5%88on_%C5%99eky_Karkar%2C_N%C3%A1horn%C3%AD_Karabach.jpg', k: 'Valleys', t: 'Green valleys & river routes', d: 'Drive-friendly landscapes and wide-open river valley viewpoints.' },
                                { href: '/where/shusha', img: 'https://portal.azertag.az/sites/default/files/shusha999.jpg', k: 'Viewpoints', t: 'Shusha panoramic edges', d: 'Cliffside views and quick nature moments near heritage routes.' },
                                { href: '/where/fuzuli', img: 'https://luckytravel.az/uploads/blog/Fuzuli.jpg', k: 'Gateway', t: 'Fuzuli route connections', d: 'A base for reaching varied landscapes and multi-stop itineraries.' },
                            ].map((card, i) => (
                                <a key={i} className="placeCard" href={card.href}>
                                    <div className="placeCard__img"><img src={card.img} alt="" /></div>
                                    <div className="placeCard__b">
                                        <div className="placeCard__k">{card.k}</div>
                                        <div className="placeCard__t">{card.t}</div>
                                        <div className="placeCard__d">{card.d}</div>
                                        <div className="placeCard__cta">Explore <span aria-hidden="true">›</span></div>
                                    </div>
                                </a>
                            ))}
                        </div>
                        <div className="cardsFoot">
                            <a className="linkBtn" href="/things-to-do/attractions?category=nature">Browse all nature spots <span aria-hidden="true">›</span></a>
                            <a className="linkBtn linkBtn--primary" href="/things-to-do/tours?category=nature">Book a nature tour <span aria-hidden="true">›</span></a>
                        </div>
                    </section>

                    {/* OUTDOOR EXPERIENCES */}
                    <section className="cards" id="experiences">
                        <header className="cardsHead">
                            <h3 className="cardsTitle">Outdoor experiences</h3>
                            <p className="cardsSub">Active options—from easy walks to full-day routes.</p>
                        </header>
                        <div className="expGrid">
                            {[
                                { href: '/things-to-do/activities?hiking=1', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80', k: 'Hiking', t: 'Scenic hikes & ridge walks', d: 'Half-day and full-day hikes with viewpoints and trail variety.' },
                                { href: '/things-to-do/activities?photo=1', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80', k: 'Photography', t: 'Sunrise & panorama spots', d: 'Golden hour locations and high-contrast landscapes for photos.' },
                                { href: '/things-to-do/activities?cycling=1', img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80', k: 'Cycling', t: 'Quiet roads & valley rides', d: 'Smooth routes and scenic segments suited for relaxed cycling.' },
                                { href: '/things-to-do/wellness?category=springs', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80', k: 'Wellness', t: 'Mineral spring stops', d: 'Nature + recovery: spring routes and calm landscape breaks.' },
                            ].map((card, i) => (
                                <a key={i} className="expCard" href={card.href}>
                                    <div className="expCard__img"><img src={card.img} alt="" /></div>
                                    <div className="expCard__b">
                                        <div className="expCard__k">{card.k}</div>
                                        <div className="expCard__t">{card.t}</div>
                                        <div className="expCard__d">{card.d}</div>
                                        <div className="expCard__cta">Explore <span aria-hidden="true">›</span></div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
}
