import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import type { MegaMenu, NavItem } from '../../types/home.types';
import logoImg from '../../../../assets/dk-logo3.png';
import './Header.css';

interface HeaderProps {
    nav: NavItem[];
    mega: MegaMenu;
}

export default function Header({ nav, mega }: HeaderProps) {

    const [openKey, setOpenKey] = useState<string | null>(null);
    const megaRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [openAcc, setOpenAcc] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
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

    const openMobile = useCallback(() => {
        setMobileOpen(true);
        lockBody();
    }, [lockBody]);

    const closeMobile = useCallback(() => {
        setMobileOpen(false);
        setOpenAcc(null);
        unlockBody();
    }, [unlockBody]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 6);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 921 && mobileOpen) closeMobile();
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [mobileOpen, closeMobile]);

    const handleNavClick = (key: string) => {
        setOpenKey(prev => (prev === key ? null : key));
    };

    const toggleAcc = (key: string) => {
        setOpenAcc(prev => (prev === key ? null : key));
    };

    const activeSection = openKey ? mega[openKey as keyof MegaMenu] : null;

    return (
        <header
            ref={headerRef}
            className={`hdr${scrolled ? ' hdr--scrolled' : ''}${openKey ? ' hdr--mega-open' : ''}`}
            id="site-header"
        >
            {/* ── TOPBAR ─────────────────────────────────────────────────────────── */}
            <div className="container hdr__inner">
                <div className="hdr__left">
                    <a className="hdr__brand" href="/" aria-label="Discover Karabakh home">
                        <img className="hdr__logo" src={logoImg} alt="Discover Karabakh" width={140} height={52} style={{ objectFit: 'contain' }} />
                    </a>
                </div>

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

                <div className="hdr__right">
                    <button className="hdr__ctaBtn" type="button" id="header-dashboard-btn" onClick={() => window.location.href = '/hotels'}>
                        Dashboard
                    </button>
                </div>

                <button
                    className="hdr__burger"
                    type="button"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-nav"
                    onClick={mobileOpen ? closeMobile : openMobile}
                    id="header-burger-btn"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* ── MEGA DROPDOWN ──────────────────────────────────────────────────── */}
            <div
                ref={megaRef}
                className={`hdr__megaShell${openKey ? ' hdr__megaShell--open' : ''}`}
                id={openKey ? `mega-${openKey}` : 'mega-panel'}
                aria-hidden={!openKey}
                role="region"
            >
                <div className="container">
                    <div className="hdr__megaPanel">
                        <div className="hdr__megaGrid">
                            {activeSection?.links.map(link => (
                                <a key={link.href} className="hdr__megaLink" href={link.href} onClick={() => setOpenKey(null)}>
                                    <strong>{link.t}</strong>
                                    <span>{link.d}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE NAV (RIGHT SIDE DRAWER) ─────────────────────────────────── */}
            <div className={`hdr__mNav${mobileOpen ? ' hdr__mNav--open' : ''}`} id="mobile-nav" aria-hidden={!mobileOpen}>
                
                {/* Backdrop */}
                <div className="hdr__mBackdrop" onClick={closeMobile} aria-hidden="true" />

                {/* Full Height Right Sheet */}
                <div className="hdr__mSheet" role="dialog" aria-modal="true" aria-label="Mobile navigation">
                    
                    <div className="hdr__mTop">
                        <img src={logoImg} alt="Discover Karabakh" className="hdr__mLogo" />
                        <button className="hdr__mClose" type="button" aria-label="Close menu" onClick={closeMobile}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="hdr__mLinks">
                        {nav.map(item => {
                            const section = mega[item.key];
                            const isOpen = openAcc === item.key;
                            return (
                                <div key={item.key} className={`hdr__mAcc${isOpen ? ' hdr__mAcc--open' : ''}`}>
                                    <button
                                        className="hdr__mAccBtn"
                                        type="button"
                                        aria-expanded={isOpen}
                                        onClick={() => toggleAcc(item.key)}
                                    >
                                        <span className="hdr__mAccLabel">{item.label}</span>
                                        {isOpen ? <ChevronDown size={18} className="acc-icon" /> : <ChevronRight size={18} className="acc-icon" />}
                                    </button>

                                    <div className="hdr__mAccPanel" role="region">
                                        <div className="hdr__mAccInner">
                                            <div className="hdr__mSubNavList">
                                                {section.links.map(link => (
                                                    <a key={link.href} className="hdr__mAccLink" href={link.href} onClick={closeMobile}>
                                                        <strong>{link.t}</strong>
                                                        <span>{link.d}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Contact */}
                        <div className="hdr__mAcc">
                            <a className="hdr__mAccBtn" href="/contact" onClick={closeMobile} style={{ textDecoration: 'none' }}>
                                <span className="hdr__mAccLabel">Contact</span>
                            </a>
                        </div>
                        
                        {/* Dashboard Button Moved Here */}
                        <div className="hdr__mDashboardWrapper">
                            <button className="hdr__mBtn hdr__mBtn--primary" type="button" onClick={() => window.location.href = '/hotels'}>
                                Dashboard
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </header>
    );
}