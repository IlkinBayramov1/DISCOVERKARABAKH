import React from 'react';

interface ArticleData {
    coverImg: string;
    title: string;
    category: string;
    readTime: string;
    published: string;
    hero?: { kicker?: string; title?: string; subtitle?: string };
    excerpt?: string;
    blocks?: Array<{
        type: 'lead' | 'section' | 'callout' | 'checklist';
        text?: string;
        id?: string;
        h?: string;
        p?: string[];
        bullets?: string[];
        title?: string;
        items?: string[];
    }>;
    related?: Array<{ slug: string; title: string }>;
}

interface ArticleProps {
    article: ArticleData;
    pageTitle?: string;
}

// TODO: article datasını API-dən və ya route loader-dən əldə edin.
// Hazırda props olaraq qəbul edir.
export default function Article({ article }: ArticleProps) {
    return (
        <main>
            <section className="aGrid">
                <div className="container" style={{ maxWidth: '920px', margin: '0 auto' }}>

                    <div style={{ marginBottom: '14px' }}>
                        <a href="/explore/articles" style={{ textDecoration: 'none' }}>‹ Back to articles</a>
                    </div>

                    <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(15,23,42,.10)' }}>
                        <div style={{ position: 'relative', aspectRatio: '16/7', background: '#0b1220' }}>
                            <img
                                src={article.coverImg}
                                alt={article.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    <div className="aMetaWrap">
                        <div className="aMeta">
                            <span className="pill pill--soft">{article.category}</span>
                            <span className="pill pill--rate">{article.readTime}</span>
                            <span className="aMeta__date">{article.published}</span>
                        </div>
                    </div>

                    <div style={{ opacity: 0.8, marginBottom: '6px' }}>
                        {article.hero?.kicker || "Discover Karabakh"}
                    </div>
                    <h1 style={{ margin: '0 0 10px' }}>
                        {article.hero?.title || article.title}
                    </h1>
                    <p style={{ margin: '0 0 18px', opacity: 0.85 }}>
                        {article.hero?.subtitle || article.excerpt}
                    </p>

                    <div style={{ display: 'grid', gap: '14px' }}>
                        {(article.blocks || []).map((b, index) => (
                            <React.Fragment key={index}>
                                {b.type === "lead" && (
                                    <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: 1.6 }}>{b.text}</p>
                                )}
                                {b.type === "section" && (
                                    <section id={b.id || ''}>
                                        <h2 style={{ margin: '10px 0 6px' }}>{b.h}</h2>
                                        {(b.p || []).map((pp, pIdx) => (
                                            <p key={pIdx} style={{ margin: '0 0 10px', opacity: 0.9, lineHeight: 1.65 }}>{pp}</p>
                                        ))}
                                        {b.bullets && b.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: '18px' }}>
                                                {b.bullets.map((li, liIdx) => (
                                                    <li key={liIdx} style={{ margin: '6px 0', opacity: 0.9 }}>{li}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                )}
                                {b.type === "callout" && (
                                    <section style={{ border: '1px solid rgba(15,23,42,.10)', borderRadius: '18px', padding: '14px' }}>
                                        <div style={{ fontWeight: 700, marginBottom: '6px' }}>{b.title}</div>
                                        <div style={{ opacity: 0.9, lineHeight: 1.6 }}>{b.text}</div>
                                    </section>
                                )}
                                {b.type === "checklist" && (
                                    <section style={{ border: '1px solid rgba(15,23,42,.10)', borderRadius: '18px', padding: '14px' }}>
                                        <div style={{ fontWeight: 700, marginBottom: '10px' }}>{b.title}</div>
                                        <ul style={{ margin: 0, paddingLeft: '18px' }}>
                                            {(b.items || []).map((it, itIdx) => (
                                                <li key={itIdx} style={{ margin: '6px 0', opacity: 0.9 }}>{it}</li>
                                            ))}
                                        </ul>
                                    </section>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {article.related && article.related.length > 0 && (
                        <div style={{ marginTop: '22px' }}>
                            <h3 style={{ margin: '0 0 10px' }}>Related articles</h3>
                            <div className="aCards">
                                {article.related.slice(0, 3).map((r, rIdx) => (
                                    <a key={rIdx} className="aCard" href={`/explore/articles/${r.slug}`}>
                                        <div className="aCard__img">
                                            <img src={article.coverImg} alt="" />
                                        </div>
                                        <div className="aCard__b">
                                            <h3 className="aCard__t">{r.title}</h3>
                                            <div className="aCard__cta">Read article <span aria-hidden="true">›</span></div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
