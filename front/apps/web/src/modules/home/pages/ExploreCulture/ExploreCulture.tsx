export default function ExploreCulture() {
    return (
        <main>
            {/* HERO */}
            <section className="hero" id="top">
                <div className="container">
                    <div className="heroCard">
                        <div className="heroMedia" aria-hidden="true">
                            <img src="https://azerbaijan.travel/fit1600x900/center/pages/256/d445c6d6-a000-428e-801c-397b0138d52a.jpg" alt="" />
                        </div>
                        <div className="heroShade" aria-hidden="true"></div>
                        <div className="heroContent">
                            <div className="heroKicker">Local culture & heritage</div>
                            <h1 className="heroTitle">Karabakh: Land of Living Traditions</h1>
                            <p className="heroSub">
                                Karabakh is a historical cultural region—more than one city—known for music, poetry, carpets,
                                craftsmanship, cuisine, and mountain-to-steppe hospitality traditions.
                            </p>
                            <div className="heroCtas">
                                <a className="btn btn--primary" href="#traditions">Explore traditions <span aria-hidden="true">›</span></a>
                                <a className="btn btn--ghost" href="#stories">Watch heritage stories <span aria-hidden="true">›</span></a>
                                <a className="btn btn--ghost" href="#crafts">Browse crafts & museums <span aria-hidden="true">›</span></a>
                            </div>
                        </div>
                        <a className="heroPlay" href="https://www.youtube.com/watch?v=nQ0Uy9m4JFg" aria-label="Jump to heritage stories">
                            <span className="playIcon" aria-hidden="true"></span>
                            <span className="playText">The Great Return: Karabakh</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* ARTICLE BODY */}
            <section className="article" id="traditions">
                <div className="container">
                    <header className="articleHead">
                        <h2 className="articleTitle">What makes Karabakh culturally unique?</h2>
                        <p className="articleLead">
                            From Shusha's music and poetry traditions to mountain villages known for storytelling and craft,
                            Karabakh's heritage is shaped by art, landscape, and everyday social rituals.
                        </p>
                    </header>

                    {/* Music & Poetry */}
                    <section className="block" id="stories">
                        <div className="blockRow">
                            <div className="blockText">
                                <h3 className="blockH">Birthplace of Azerbaijani Music & Poetry</h3>
                                <p className="blockP">
                                    Shusha is historically associated with Azerbaijan's classical music and literary culture. It is known as the birthplace
                                    of Uzeyir Hajibeyov (founder of Azerbaijani classical music) and as a home of prominent cultural figures
                                    such as Bulbul, Khan Shushinski, and Natavan.
                                </p>
                                <p className="blockP">
                                    Karabakh's Mugham tradition has long been influential, while ashug storytelling traditions remain strong in
                                    mountain areas such as Lachin and Kalbajar.
                                </p>
                                <div className="miniGrid">
                                    <article className="miniCard">
                                        <div className="miniCard__k">Mugham heritage</div>
                                        <div className="miniCard__t">A dominant school of performance</div>
                                        <p className="miniCard__p">Karabakh Mugham traditions influenced performance styles across Azerbaijan.</p>
                                    </article>
                                    <article className="miniCard">
                                        <div className="miniCard__k">Ashug storytelling</div>
                                        <div className="miniCard__t">Mountain village tradition</div>
                                        <p className="miniCard__p">Narrative songs and saz culture remain tied to village life and gatherings.</p>
                                    </article>
                                    <article className="miniCard">
                                        <div className="miniCard__k">Poetry salons</div>
                                        <div className="miniCard__t">Shusha literary circles</div>
                                        <p className="miniCard__p">Poetry, music, and social salons shaped cultural memory and identity.</p>
                                    </article>
                                </div>
                            </div>
                            <aside className="blockAside">
                                <div className="asideMedia">
                                    <img src="https://www.virtualkarabakh.az/sekiller/c6aacf12846594e1512676702.jpg" alt="Heritage scenery" />
                                </div>
                                <div className="asideCallout">
                                    <div className="asideCallout__k">Quick context</div>
                                    <div className="asideCallout__t">Shusha is often called the cultural capital</div>
                                    <p className="asideCallout__p">A hub of music, poetry, and heritage routes—ideal for slow exploration and meaningful stops.</p>
                                    <a className="asideLink" href="/where/shusha">Explore Shusha <span aria-hidden="true">›</span></a>
                                </div>
                            </aside>
                        </div>
                    </section>

                    {/* Carpets */}
                    <section className="block" id="crafts">
                        <div className="blockRow blockRow--reverse">
                            <div className="blockText">
                                <h3 className="blockH">Carpet Weaving & Artisan Traditions</h3>
                                <p className="blockP">
                                    The Karabakh Carpet School is one of Azerbaijan's major carpet traditions, known for distinctive compositions and
                                    recognizable patterns. Historic styles are often associated with Dragon carpets, Bakhchadagullari, Malibayli, and Shusha carpets.
                                </p>
                                <div className="bulletCols">
                                    <div className="bulletCol">
                                        <h4 className="bulletH">Notable patterns</h4>
                                        <ul className="bulletList">
                                            <li>Dragon carpets</li><li>Bakhchadagullari</li><li>Malibayli</li><li>Shusha carpets</li>
                                        </ul>
                                    </div>
                                    <div className="bulletCol">
                                        <h4 className="bulletH">Materials & methods</h4>
                                        <ul className="bulletList">
                                            <li>Wool from mountain sheep</li><li>Natural dyes</li><li>Hand weaving</li><li>Motifs tied to place and story</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <aside className="blockAside">
                                <div className="asideMedia">
                                    <img src="https://www.virtualkarabakh.az/sekiller/2c5a5a318c2da231521985363.jpg" alt="Craft tradition" />
                                </div>
                                <div className="asideCallout">
                                    <div className="asideCallout__k">Modern revival</div>
                                    <div className="asideCallout__t">Workshops & exhibitions</div>
                                    <p className="asideCallout__p">Reconstructed cultural spaces and craft exhibitions aim to reintroduce the Karabakh craft tradition.</p>
                                    <a className="asideLink" href="/explore/about#find">Browse categories <span aria-hidden="true">›</span></a>
                                </div>
                            </aside>
                        </div>
                    </section>

                    {/* Heritage Sites */}
                    <section className="cards" id="heritage-cards">
                        <header className="cardsHead">
                            <h3 className="cardsTitle">Heritage sites discovery cards</h3>
                            <p className="cardsSub">Start with these cultural highlights and routes across Karabakh.</p>
                        </header>
                        <div className="cardGrid">
                            {[
                                { href: '/where/shusha', img: 'https://idsb.tmgrup.com.tr/ly/uploads/images/2023/11/15/301158.jpg', k: 'Heritage', t: 'Shusha historical quarter', d: 'Historic streets, cultural venues, and heritage routes.' },
                                { href: '/things-to-do/attractions', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/A%C5%9Fa%C4%9F%C4%B1_G%C3%B6vh%C9%99r_a%C4%9Fa_m%C9%99scidi_restavrasiya_i%C5%9Fl%C9%99rind%C9%99n_sonra%2C_2024-c%C3%BC_ild%C9%99.jpg', k: 'Landmark', t: 'Govhar Agha Mosque', d: 'A cultural landmark connected to Shusha\'s historic fabric.' },
                                { href: '/things-to-do/attractions', img: 'https://shusha.gov.az/storage/app/uploads/public/659/c04/400/659c044004d55024880413.jpg', k: 'Culture', t: 'Natavan House', d: 'A stop tied to Karabakh\'s poetry and cultural memory.' },
                                { href: '/where/kalbajar', img: 'https://fed.az/upload/news/358065.jpg', k: 'Traditions', t: 'Kalbajar mineral springs', d: 'Highland routes and local wellness traditions.' },
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
                    </section>
                </div>
            </section>
        </main>
    );
}
