// Accommodation səhifəsi — HomeLayout daxilindədir (Header/Footer Layout-da).
// HTML/body wrapperları silindi. Sadəcə <main> content qalır.

export default function Accommodation() {
    return (
        <main>
            {/* HERO */}
            <section className="hero">
                <div className="container">
                    <div className="heroCard">
                        <div className="heroMedia">
                            <img
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=80"
                                alt="Accommodation in Karabakh"
                            />
                        </div>
                        <div className="heroShade"></div>
                        <div className="heroContent">
                            <div className="heroKicker">Accommodation</div>
                            <h1 className="heroTitle">Where to stay in Karabakh</h1>
                            <p className="heroSub">
                                From premium hotels and boutique stays to apartment rentals and family lodgings —
                                choose the right base for your journey across Karabakh.
                            </p>
                            <div className="heroCtas">
                                <a className="btn btn--primary" href="#hotels">Hotels</a>
                                <a className="btn btn--ghost" href="#apartments">Apartments</a>
                                <a className="btn btn--ghost" href="#tips">Stay tips</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="article">
                <div className="container">
                    <header className="articleHead">
                        <h2 className="articleTitle">Choose your base wisely</h2>
                        <p className="articleLead">
                            Your accommodation defines your daily rhythm — access to attractions, sunrise views,
                            dining options, and transport convenience. Below is a structured guide to staying in Karabakh.
                        </p>
                    </header>

                    {/* HOTELS */}
                    <section className="block" id="hotels">
                        <div className="blockRow">
                            <div className="blockText">
                                <h3 className="blockH">Hotels: comfort & full service</h3>
                                <p className="blockP">
                                    Hotels are ideal for visitors who want structured comfort — reception support,
                                    restaurant access, housekeeping, and concierge assistance.
                                </p>
                                <div className="featureList">
                                    <article className="feat">
                                        <h4 className="feat__t">Best for</h4>
                                        <ul>
                                            <li>Short city stays</li>
                                            <li>Business travel</li>
                                            <li>First-time visitors</li>
                                            <li>Premium experience seekers</li>
                                        </ul>
                                    </article>
                                    <article className="feat">
                                        <h4 className="feat__t">Advantages</h4>
                                        <ul>
                                            <li>Daily housekeeping</li>
                                            <li>On-site dining</li>
                                            <li>Security & reception</li>
                                            <li>Central locations</li>
                                        </ul>
                                    </article>
                                </div>
                                <div className="note">
                                    <strong>Tip:</strong> In Shusha and central hubs, book early during peak seasons or major events.
                                </div>
                            </div>
                            <aside className="blockAside">
                                <div className="asideMedia">
                                    <img src="https://arsigroup.az/wp-content/uploads/2023/06/20230623_203051-1024x527.jpg" alt="City-center hotel" />
                                </div>
                                <div className="asideCallout">
                                    <div className="asideCallout__k">Recommended</div>
                                    <div className="asideCallout__t">City-center hotel</div>
                                    <p className="asideCallout__p">
                                        Ideal if your itinerary focuses on cultural landmarks and dining.
                                    </p>
                                    <a className="asideLink" href="#">Browse hotels ›</a>
                                </div>
                            </aside>
                        </div>
                    </section>

                    {/* APARTMENTS */}
                    <section className="block" id="apartments">
                        <div className="blockRow blockRow--reverse">
                            <div className="blockText">
                                <h3 className="blockH">Apartments & rentals: flexibility & privacy</h3>
                                <p className="blockP">
                                    Apartment rentals are perfect for longer stays, families, or travelers who prefer
                                    independence and home-style living.
                                </p>
                                <div className="featureList">
                                    <article className="feat">
                                        <h4 className="feat__t">Best for</h4>
                                        <ul>
                                            <li>Families & groups</li>
                                            <li>Longer stays</li>
                                            <li>Remote workers</li>
                                            <li>Budget-conscious travelers</li>
                                        </ul>
                                    </article>
                                    <article className="feat">
                                        <h4 className="feat__t">Advantages</h4>
                                        <ul>
                                            <li>Kitchen access</li>
                                            <li>More space</li>
                                            <li>Flexible check-in</li>
                                            <li>Local neighborhood experience</li>
                                        </ul>
                                    </article>
                                </div>
                                <div className="note">
                                    <strong>Consider:</strong> Check transport access if the rental is outside city center.
                                </div>
                            </div>
                            <aside className="blockAside">
                                <div className="asideMedia">
                                    <img src="https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1400&q=80" alt="Apartment living" />
                                </div>
                                <div className="asideCallout">
                                    <div className="asideCallout__k">Flexible stay</div>
                                    <div className="asideCallout__t">Apartment living</div>
                                    <p className="asideCallout__p">
                                        Great balance between cost, comfort and independence.
                                    </p>
                                    <a className="asideLink" href="#">View apartments ›</a>
                                </div>
                            </aside>
                        </div>
                    </section>

                    {/* STAY TYPES GRID */}
                    <section className="cards">
                        <header className="cardsHead">
                            <h3 className="cardsTitle">Accommodation types</h3>
                            <p className="cardsSub">Match your travel style with the right stay.</p>
                        </header>
                        <div className="cardGrid">
                            <div className="placeCard">
                                <div className="placeCard__b">
                                    <div className="placeCard__k">Luxury</div>
                                    <div className="placeCard__t">Premium hotels</div>
                                    <div className="placeCard__d">Full-service comfort and elevated amenities.</div>
                                </div>
                            </div>
                            <div className="placeCard">
                                <div className="placeCard__b">
                                    <div className="placeCard__k">Boutique</div>
                                    <div className="placeCard__t">Small design stays</div>
                                    <div className="placeCard__d">Character, intimacy and curated experiences.</div>
                                </div>
                            </div>
                            <div className="placeCard">
                                <div className="placeCard__b">
                                    <div className="placeCard__k">Family</div>
                                    <div className="placeCard__t">Apartments & houses</div>
                                    <div className="placeCard__d">Spacious options for longer stays.</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* TIPS */}
                    <section className="cards" id="tips">
                        <header className="cardsHead">
                            <h3 className="cardsTitle">Smart booking tips</h3>
                            <p className="cardsSub">Avoid common accommodation mistakes.</p>
                        </header>
                        <div className="infoGrid">
                            <div className="infoCard">
                                <div className="infoCard__t">Check location first</div>
                                <div className="infoCard__d">Distance to main attractions matters more than price alone.</div>
                            </div>
                            <div className="infoCard">
                                <div className="infoCard__t">Confirm cancellation policy</div>
                                <div className="infoCard__d">Weather or itinerary changes can affect plans.</div>
                            </div>
                            <div className="infoCard">
                                <div className="infoCard__t">Book early in peak season</div>
                                <div className="infoCard__d">Major festivals and holidays increase demand quickly.</div>
                            </div>
                            <div className="infoCard">
                                <div className="infoCard__t">Match stay with transport</div>
                                <div className="infoCard__d">Choose accommodation aligned with your route plan.</div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
}
