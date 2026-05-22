import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import './Utility.css';

const providers = [
    {
        id: 'gas',
        name: 'Azəriqaz',
        description: 'Qaz sərfiyyatı borcunuzu ödəyin',
        logoUrl: 'https://placehold.co/150x150/f97316/ffffff?text=Azeriqaz',
        color: 'amber'
    },
    {
        id: 'water',
        name: 'Azərsu',
        description: 'Su və kanalizasiya borcunuzu ödəyin',
        logoUrl: 'https://placehold.co/150x150/0ea5e9/ffffff?text=Azersu',
        color: 'sky'
    },
    {
        id: 'electricity',
        name: 'Azərişıq',
        description: 'Elektrik enerjisi borcunuzu ödəyin',
        logoUrl: 'https://placehold.co/150x150/eab308/ffffff?text=Azerisiq',
        color: 'yellow'
    }
];

export default function UtilityProviders() {
    const navigate = useNavigate();

    return (
        <div className="web-utility-page">
            <div className="web-utility-container" style={{ maxWidth: '800px' }}>
                <div className="web-utility-header text-center">
                    <h1>Kommunal Borcların Ödənilməsi</h1>
                    <p>Ödəniş etmək istədiyiniz kommunal xidməti seçin.</p>
                </div>

                <div className="utility-providers-grid">
                    {providers.map(provider => (
                        <div 
                            key={provider.id} 
                            className="web-provider-card"
                            onClick={() => navigate(`/utility/${provider.id}`)}
                        >
                            <div className="provider-logo-wrapper">
                                <img 
                                    src={provider.logoUrl} 
                                    alt={provider.name}
                                />
                            </div>
                            <h3>{provider.name}</h3>
                            <p>{provider.description}</p>
                        </div>
                    ))}
                </div>
                
                <div className="utility-secure-badge">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <span>Ödənişləriniz dövlət portalı üzərindən təhlükəsiz qorunur</span>
                </div>
            </div>
        </div>
    );
}
