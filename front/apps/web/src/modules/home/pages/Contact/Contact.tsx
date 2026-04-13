export default function Contact() {
    return (
        <main>
            <section className="contactHero" id="contact-top">
                <div className="container">
                    <div className="cHeroCard">
                        <div className="cHeroMedia" aria-hidden="true">
                            <img
                                src="https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg"
                                alt="Karabakh Landscape"
                            />
                        </div>
                        <div className="cHeroOverlay" aria-hidden="true"></div>
                        <div className="cHeroContent">
                            <h1 className="cHeroTitle">Get in touch</h1>
                            <p className="cHeroDesc">
                                Whether you need help planning your itinerary, have questions about the Discover Card, or want to partner with us, our team is here to help.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contactMain" id="contact-info">
                <div className="container">
                    <div className="contactGrid">

                        <div className="contactDetails">
                            <h2 className="contact__heading">Contact Information</h2>

                            <div className="cInfoCard">
                                <span className="cInfoCard__icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M12 21s6-5 6-10a6 6 0 1 0-12 0c0 5 6 10 6 10Z" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </span>
                                <div className="cInfoCard__body">
                                    <div className="cInfoCard__h">Headquarter</div>
                                    <div className="cInfoCard__p">
                                        Ramiz Gambarov st, Building 10, Entry 19, Shusha city, Azerbaijan, AZ5800
                                    </div>
                                </div>
                            </div>

                            <div className="cInfoCard">
                                <span className="cInfoCard__icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <div className="cInfoCard__body">
                                    <div className="cInfoCard__h">Reach Out</div>
                                    <div className="cInfoCard__p">
                                        <a href="mailto:contact@discoverkarabakh.com">contact@discoverkarabakh.com</a><br />
                                        <a href="tel:+994262662526">+994 26 266 25 26</a>
                                    </div>
                                </div>
                            </div>

                            <div className="cInfoCard">
                                <span className="cInfoCard__icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <div className="cInfoCard__body">
                                    <div className="cInfoCard__h">Legal Information</div>
                                    <div className="cInfoCard__p">
                                        <strong>VÖEN:</strong> 8600225041
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contactFormWrap">
                            <div className="cFormCard">
                                <h3 className="cForm__title">Send us a message</h3>
                                <p className="cForm__desc">Fill out the form below and we'll get back to you within 24 hours.</p>

                                <form action="/submit-contact" method="POST" className="cForm">
                                    <div className="cForm__row">
                                        <div className="cForm__group">
                                            <label htmlFor="fname">First Name</label>
                                            <input type="text" id="fname" name="fname" placeholder="e.g. Ali" required />
                                        </div>
                                        <div className="cForm__group">
                                            <label htmlFor="lname">Last Name</label>
                                            <input type="text" id="lname" name="lname" placeholder="e.g. Mammadov" required />
                                        </div>
                                    </div>
                                    <div className="cForm__group">
                                        <label htmlFor="email">Email Address</label>
                                        <input type="email" id="email" name="email" placeholder="you@example.com" required />
                                    </div>
                                    <div className="cForm__group">
                                        <label htmlFor="subject">Subject</label>
                                        <div className="cForm__selectWrap">
                                            <select id="subject" name="subject" required defaultValue="">
                                                <option value="" disabled>Select a topic...</option>
                                                <option value="planning">Trip Planning & Itineraries</option>
                                                <option value="pass">Discover Karabakh Pass</option>
                                                <option value="partnership">Business Partnership</option>
                                                <option value="other">Other Inquiry</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="cForm__group">
                                        <label htmlFor="message">Message</label>
                                        <textarea id="message" name="message" rows={5} placeholder="How can we help you?" required></textarea>
                                    </div>
                                    <button type="submit" className="cForm__submit">
                                        Send Message <span aria-hidden="true">›</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
