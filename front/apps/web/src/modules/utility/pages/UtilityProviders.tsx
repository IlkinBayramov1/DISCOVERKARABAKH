import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Flame, Droplet, Zap, ArrowRight } from 'lucide-react';
import './UtilityProviders.css'; // Yeni CSS faylını bura bağlayın

// Təkmilləşdirilmiş provayder siyahısı (Lucide ikonları ilə)
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
            <div className="up-container">
                
                {/* Header Section */}
                <div className="up-header">
                    <h1>Kommunal Borcların Ödənilməsi</h1>
                    <p>Ödəniş etmək istədiyiniz dövlət kommunal xidmətini seçin və abonent kodunuzla əməliyyatı tamamlayın.</p>
                </div>

                {/* Providers Grid */}
                <div className="up-providers-grid">
                    {providers.map(provider => {
                        const IconComponent = provider.icon;
                        return (
                            <div 
                                key={provider.id} 
                                className={`up-provider-card ${provider.colorClass}`}
                                onClick={() => navigate(`/utility/${provider.id}`)}
                            >
                                <div className={`up-icon-wrapper ${provider.colorClass}`}>
                                    <IconComponent size={36} strokeWidth={2.5} />
                                </div>
                                
                                <h3>{provider.name}</h3>
                                <p>{provider.description}</p>
                                
                                <div className="up-action-icon">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Secure Badge */}
                <div className="up-secure-badge">
                    <ShieldCheck size={20} />
                    <span>Ödənişləriniz dövlət portalı üzərindən 256-bit şifrələmə ilə təhlükəsiz qorunur</span>
                </div>

            </div>
        </div>
    );
}