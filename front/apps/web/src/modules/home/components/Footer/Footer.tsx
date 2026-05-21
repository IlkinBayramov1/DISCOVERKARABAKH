import React from 'react';
import type { FormEvent } from 'react';
import logo from '../../../../assets/dk-logo3.png';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Burada abunə olmaq üçün lazımi API müraciətini edə bilərsiniz
    console.log('Form göndərildi');
  };

  return (
    <footer className="siteFooter" id="footer">
      <div className="container">
        {/* Top: brand + newsletter */}
        <div className="footerTop">
          <div className="footerBrand">
            <a className="brand" href="/" aria-label="Discover Karabakh">
              <img
                className="brand__logoImg"
                src={logo}
                alt="Discover Karabakh"
              />
            </a>
            <p className="footerTag">
              A smart travel & city-services platform for Karabakh — explore places, plan trips, book services, and save with City Pass.
            </p>

            <div className="footerSocial" aria-label="Social links">
              <a className="socBtn" href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2ZM17.6 6.9a.9.9 0 1 1-.9-.9.9.9 0 0 1 .9.9Z" />
                </svg>
              </a>
              <a className="socBtn" href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V5a23 23 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V11H7.4v3H10v8h3.5Z" />
                </svg>
              </a>
              <a className="socBtn" href="#" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.9 2H22l-6.8 7.8L23 22h-6.7l-5.3-6.7L5.1 22H2l7.3-8.4L1 2h6.9l4.8 6.1L18.9 2Zm-1.2 18h1.7L7.1 3.9H5.3L17.7 20Z" />
                </svg>
              </a>
              <a className="socBtn" href="#" aria-label="YouTube">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10.3 14.9V9.1L15.4 12l-5.1 2.9Z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footerNewsletter">
            <div className="newsCard">
              <div className="newsTitle">Get travel updates</div>
              <div className="newsText">New routes, events, curated itineraries, and City Pass offers — occasionally.</div>

              <form className="newsForm" onSubmit={handleSubscribe}>
                <label className="srOnly" htmlFor="newsEmail">Email</label>
                <input 
                  id="newsEmail" 
                  name="email" 
                  type="email" 
                  placeholder="Email address" 
                  required 
                />
                <button type="submit">Subscribe</button>
              </form>

              <div className="newsFine">
                By subscribing, you agree to our <a href="#privacy">Privacy Policy</a>.
              </div>
            </div>
          </div>
        </div>

        {/* Middle: link columns */}
        <div className="footerGrid">
          <div className="footerCol">
            <div className="footerCol__title">Explore</div>
            <a href="/explore/about">About Karabakh</a>
            <a href="/explore/culture">History & culture</a>
            <a href="/explore/nature">Nature & landscapes</a>
            <a href="/explore/articles">Articles & guides</a>
          </div>

          <div className="footerCol">
            <div className="footerCol__title">Things to do</div>
            <a href="/things-to-do/attractions">Attractions</a>
            <a href="/things-to-do/restaurants">Food & gastronomy</a>
            <a href="/things-to-do/tours">Tours & experiences</a>
            <a href="/things-to-do/wellness">Health & wellness</a>
          </div>

          <div className="footerCol">
            <div className="footerCol__title">Plan your trip</div>
            <a href="/plan/transportation">Transport & transfers</a>
            <a href="/plan/accommodation">Accommodation</a>
            <a href="/plan/visa-permissions">Visa & permissions</a>
            <a href="/plan/card-and-passes">Discover card & Passes</a>
          </div>

          <div className="footerCol footerContact">
            <div className="footerCol__title">Contact</div>

            <div className="contactRow">
              <span className="contactLabel">Email</span>
              <a href="mailto:contact@discoverkarabakh.com">contact@discoverkarabakh.com</a>
            </div>

            <div className="contactRow">
              <span className="contactLabel">Phone</span>
              <a href="tel:+994262662526">+994 (26) 266 25 26</a>
            </div>
          </div>
        </div>

        {/* Bottom: policies + legal */}
        <div className="footerBottom">
          <div className="footerLegal">
            <span>© <span id="footerYear">{currentYear}</span> Discover Karabakh</span>
            <span className="sep">•</span>
            <span>All rights reserved</span>
          </div>

          <div className="footerPolicies" aria-label="Policies">
            <a id="privacy" href="#privacy-policy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
            <a href="#accessibility">Accessibility</a>
            <a href="#refunds">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;