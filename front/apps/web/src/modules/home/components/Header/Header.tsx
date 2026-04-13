import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { MegaMenu, NavItem } from '../../types/home.types';
import './Header.css';

// ─── Logo (inline SVG-ə keçid etmiyirik, path-i saxlayırıq) ─────────────────
const LOGO_SRC = '/images/dk logo main3.png';

interface HeaderProps {
    nav: NavItem[];
    mega: MegaMenu;
}

export default function Header({ nav, mega }: HeaderProps) {

    // ── Mega Menu state ────────────────────────────────────────────────────────
    const [openKey, setOpenKey] = useState<string | null>(null);
    const megaRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);

    // ── Mobile menu state ──────────────────────────────────────────────────────
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openAcc, setOpenAcc] = useState<string | null>(null);  // accordion

    // ── Scrolled state (shadow on scroll) ─────────────────────────────────────
    const [scrolled, setScrolled] = useState(false);

    // ── Scroll lock helpers ────────────────────────────────────────────────────
    const scrollPosRef = useRef(0);

    const lockBody = useCallback(() => {
        scrollPosRef.current = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosRef.current}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
    }, []);

    const unlockBody = useCallback(() => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPosRef.current);
    }, []);

    // ── Open / close mobile menu ───────────────────────────────────────────────
    const openMobile = useCallback(() => {
        setMobileOpen(true);
        lockBody();
    }, [lockBody]);

    const closeMobile = useCallback(() => {
        setMobileOpen(false);
        setOpenAcc(null);
        unlockBody();
    }, [unlockBody]);

    // ── Global effects ─────────────────────────────────────────────────────────
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 6);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mega on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpenKey(null);
                if (mobileOpen) closeMobile();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [mobileOpen, closeMobile]);

    // Close mega on outside click
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (
                headerRef.current &&
                !headerRef.current.contains(e.target as Node)
            ) {
                setOpenKey(null);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    // Close mobile on resize ≥921
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 921 && mobileOpen) closeMobile();
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [mobileOpen, closeMobile]);

    // ── Nav pill click → toggle mega ──────────────────────────────────────────
    const handleNavClick = (key: string) => {
        setOpenKey(prev => (prev === key ? null : key));
    };

    // ── Accordion toggle ───────────────────────────────────────────────────────
    const toggleAcc = (key: string) => {
        setOpenAcc(prev => (prev === key ? null : key));
    };

    // ── Active mega section ────────────────────────────────────────────────────
    const activeSection = openKey ? mega[openKey as keyof MegaMenu] : null;

    return (
        <header
            ref={headerRef}
            className={`hdr${scrolled ? ' hdr--scrolled' : ''}${openKey ? ' hdr--mega-open' : ''}`}
            id="site-header"
        >
            {/* ── TOPBAR ─────────────────────────────────────────────────────────── */}
            <div className="container hdr__inner">

                {/* Brand */}
                <div className="hdr__left">
                    <a className="hdr__brand" href="/" aria-label="Discover Karabakh home">
                        <img
                            className="hdr__logo"
                            src={LOGO_SRC}
                            alt="Discover Karabakh"
                            width={140}
                            height={52}
                        />
                    </a>
                </div>

                {/* Desktop nav */}
                <nav className="hdr__nav" aria-label="Primary navigation">
                    <div className="hdr__navGroup">
                        {nav.map(item => (
                            <button
                                key={item.key}
                                id={`nav-pill-${item.key}`}
                                className={`hdr__pill${openKey === item.key ? ' hdr__pill--open' : ''}`}
                                type="button"
                                aria-expanded={openKey === item.key}
                                aria-controls={`mega-${item.key}`}
                                onClick={() => handleNavClick(item.key)}
                            >
                                {item.label}
                                <span className="hdr__chev" aria-hidden="true" />
                            </button>
                        ))}
                        <a className="hdr__pill" href="/contact">Contact</a>
                    </div>
                </nav>

                {/* Right CTA */}
                <div className="hdr__right">
                    <button className="hdr__ctaBtn" type="button" id="header-dashboard-btn" onClick={() => window.location.href = '/hotels'}>
                        Dashboard
                    </button>
                </div>

                {/* Burger */}
                <button
                    className={`hdr__burger${mobileOpen ? ' hdr__burger--open' : ''}`}
                    type="button"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-nav"
                    onClick={mobileOpen ? closeMobile : openMobile}
                    id="header-burger-btn"
                >
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                </button>
            </div>

            {/* ── MEGA DROPDOWN ──────────────────────────────────────────────────── */}
            <div
                ref={megaRef}
                className={`hdr__megaShell${openKey ? ' hdr__megaShell--open' : ''}`}
                id={openKey ? `mega-${openKey}` : 'mega-panel'}
                aria-hidden={!openKey}
                role="region"
                aria-label={openKey ? `${openKey} menu` : undefined}
            >
                <div className="container">
                    <div className="hdr__megaPanel">
                        <div className="hdr__megaGrid">
                            {activeSection?.links.map(link => (
                                <a
                                    key={link.href}
                                    className="hdr__megaLink"
                                    href={link.href}
                                    onClick={() => setOpenKey(null)}
                                >
                                    <strong>{link.t}</strong>
                                    <span>{link.d}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE NAV ─────────────────────────────────────────────────────── */}
            <div
                className={`hdr__mNav${mobileOpen ? ' hdr__mNav--open' : ''}`}
                id="mobile-nav"
                aria-hidden={!mobileOpen}
            >
                {/* Backdrop */}
                <div
                    className="hdr__mBackdrop"
                    onClick={closeMobile}
                    aria-hidden="true"
                />

                {/* Sheet */}
                <div
                    className="hdr__mSheet"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
                >
                    {/* Sheet header */}
                    <div className="hdr__mTop">
                        <span className="hdr__mTitle">Menu</span>
                        <button
                            className="hdr__mClose"
                            type="button"
                            aria-label="Close menu"
                            onClick={closeMobile}
                            id="mobile-nav-close-btn"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Accordion nav items */}
                    <div className="hdr__mLinks">
                        {nav.map(item => {
                            const section = mega[item.key];
                            const isOpen = openAcc === item.key;
                            return (
                                <div
                                    key={item.key}
                                    className={`hdr__mAcc${isOpen ? ' hdr__mAcc--open' : ''}`}
                                    id={`mobile-acc-${item.key}`}
                                >
                                    <button
                                        className="hdr__mAccBtn"
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-controls={`mobile-acc-panel-${item.key}`}
                                        onClick={() => toggleAcc(item.key)}
                                        id={`mobile-acc-trigger-${item.key}`}
                                    >
                                        <span className="hdr__mAccLabel">{item.label}</span>
                                        <span className="hdr__mAccChev" aria-hidden="true" />
                                    </button>

                                    <div
                                        className="hdr__mAccPanel"
                                        id={`mobile-acc-panel-${item.key}`}
                                        role="region"
                                        aria-labelledby={`mobile-acc-trigger-${item.key}`}
                                    >
                                        <div className="hdr__mAccInner">
                                            {section.links.map(link => (
                                                <a
                                                    key={link.href}
                                                    className="hdr__mAccLink"
                                                    href={link.href}
                                                    onClick={closeMobile}
                                                >
                                                    <strong>{link.t}</strong>
                                                    <span>{link.d}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Contact (no dropdown) */}
                        <div className="hdr__mAcc">
                            <a
                                className="hdr__mAccBtn hdr__mAccBtn--link"
                                href="/contact"
                                onClick={closeMobile}
                                id="mobile-nav-contact-link"
                            >
                                <span className="hdr__mAccLabel">Contact</span>
                            </a>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="hdr__mActions">
                        <button className="hdr__mBtn hdr__mBtn--ghost" type="button" id="mobile-nav-search-btn">Search</button>
                        <button className="hdr__mBtn hdr__mBtn--ghost" type="button" id="mobile-nav-lang-btn">EN</button>
                        <button className="hdr__mBtn hdr__mBtn--primary" type="button" id="mobile-nav-dashboard-btn" onClick={() => window.location.href = '/hotels'}>Dashboard</button>
                    </div>
                </div>
            </div>
        </header>
    );
}
