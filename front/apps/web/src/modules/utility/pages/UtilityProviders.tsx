import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Flame, Droplet, Zap, ArrowRight, Building2 } from 'lucide-react';
import './UtilityProviders.css';

const providers = [
    {
        id: 'gas',
        name: 'Azəriqaz',
        description: 'Qaz sərfiyyatı borcunuzu yoxlayın və anında ödəniş edin.',
        icon: Flame,
        colorClass: 'gas'
    },
    {
        id: 'water',
        name: 'Azərsu',
        description: 'Su və kanalizasiya xidmətləri üzrə borcunuzu ödəyin.',
        icon: Droplet,
        colorClass: 'water'
    },
    {
        id: 'electricity',
        name: 'Azərişıq',
        description: 'Elektrik enerjisi borcunuzu sürətli və etibarlı ödəyin.',
        icon: Zap,
        colorClass: 'electricity'
    }
];

export default function UtilityProviders() {
    const navigate = useNavigate();

    return (
        <div className="up-page">
            <main className="up-container">
                
                {/* HERO SECTION (Matches Hotel & Utility Search) */}
                <section className="up-hero">
                    <div className="up-hero-gradient"></div>
                    <div className="up-hero-overlay">
                        <div className="up-hero-icon-wrapper">
                            <Building2 size={28} />
                        </div>
                        <h1>Kommunal Xidmətlər</h1>
                        <p>Ödəniş etmək istədiyiniz dövlət kommunal xidmətini seçin və abonent kodunuzla əməliyyatı asanlıqla tamamlayın.</p>
                    </div>
                </section>

                {/* PROVIDERS GRID */}
                <div className="up-providers-grid">
                    {providers.map(provider => {
                        const IconComponent = provider.icon;
                        return (
                            <div 
                                key={provider.id} 
                                className={`up-provider-card ${provider.colorClass}`}
                                onClick={() => navigate(`/utility/${provider.id}`)}
                            >
                                <div className="up-card-header">
                                    <div className={`up-icon-wrapper ${provider.colorClass}`}>
                                        <IconComponent size={28} strokeWidth={2.5} />
                                    </div>
                                    <div className="up-action-icon">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                                
                                <div className="up-card-content">
                                    <h3>{provider.name}</h3>
                                    <p>{provider.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* SECURE BADGE */}
                <div className="up-secure-badge-wrapper">
                    <div className="up-secure-badge">
                        <ShieldCheck size={20} />
                        <span>Ödənişləriniz dövlət portalı üzərindən <strong>256-bit şifrələmə</strong> ilə tam təhlükəsiz qorunur.</span>
                    </div>
                </div>

            </main>
        </div>
    );
}