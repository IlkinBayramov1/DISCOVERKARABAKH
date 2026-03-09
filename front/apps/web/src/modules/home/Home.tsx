import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState('');
    const [guests, setGuests] = useState('2 x Adult, 1 x Room');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchParams = new URLSearchParams({
            q: destination,
            guests: guests
        });
        navigate(`/hotels?${searchParams.toString()}`);
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Experience the Magic of <span>Karabakh</span></h1>
                    <p className="hero-subtitle">Discover pristine nature, ancient heritage, and world-class hospitality.</p>

                    {/* Glassmorphism Search Engine */}
                    <div className="search-engine glassmorphism">
                        <form onSubmit={handleSearch} className="search-form">

                            <div className="search-field">
                                <label><MapPin size={16} /> Destination</label>
                                <input
                                    type="text"
                                    placeholder="Where are you going? (e.g. Shusha)"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>

                            <div className="search-divider"></div>

                            <div className="search-field">
                                <label><Calendar size={16} /> Dates</label>
                                <input
                                    type="text"
                                    placeholder="Check In - Check Out"
                                    value={dates}
                                    onChange={(e) => setDates(e.target.value)}
                                />
                            </div>

                            <div className="search-divider"></div>

                            <div className="search-field">
                                <label><Users size={16} /> Guests</label>
                                <input
                                    type="text"
                                    placeholder="2 Adults, 1 Room"
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="search-btn">
                                <Search size={20} />
                                <span>Search</span>
                            </button>

                        </form>
                    </div>
                </div>
            </section>

            {/* Featured Categories / Promo Section */}
            <section className="promo-section max-w-7xl mx-auto px-4 py-8">
                <div className="promo-header flex-between mb-3">
                    <h2 className="font-bold text-xl">Top Destinations</h2>
                    <button className="btn-secondary outline">Explore All</button>
                </div>
                <div className="promo-grid">
                    <div className="promo-card">
                        <img src="https://images.unsplash.com/photo-1542401886-65d6c61db217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" alt="Mountain View" />
                        <div className="promo-card-content glassmorphism">
                            <h3>Shusha Mountains</h3>
                            <p>Luxury Retreats</p>
                        </div>
                    </div>
                    <div className="promo-card">
                        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" alt="Valley" />
                        <div className="promo-card-content glassmorphism">
                            <h3>Lachin Valleys</h3>
                            <p>Nature Trails</p>
                        </div>
                    </div>
                    <div className="promo-card">
                        <img src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" alt="Forest" />
                        <div className="promo-card-content glassmorphism">
                            <h3>Aghdam Heritage</h3>
                            <p>Cultural Hubs</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
