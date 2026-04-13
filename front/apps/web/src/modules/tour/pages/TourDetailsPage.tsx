import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tourWebApi } from '../api/tour.api';
import type { ITour } from '../types';
import './TourDetailsPage.css';

export const TourDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [tour, setTour] = useState<ITour | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTour = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await tourWebApi.getTourById(id);
                setTour(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch tour details');
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [id]);

    if (loading) return <div className="min-h-screen py-12 text-center text-gray-500">Loading tour details...</div>;
    if (error) return <div className="min-h-screen py-12 text-center text-red-500">{error}</div>;
    if (!tour) return <div className="min-h-screen py-12 text-center text-gray-500">Tour not found</div>;

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            tour.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            tour.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            tour.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                            'bg-gray-900 text-white'
                        }`}>
                            {tour.difficulty}
                        </span>
                        <span className="text-gray-500 flex items-center gap-2">
                            🕒 {tour.duration.days} Days / {tour.duration.nights} Nights
                        </span>
                        <span className="text-gray-500 flex items-center gap-2">
                            👥 {tour.groupSize.min}-{tour.groupSize.max} People
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900">{tour.name}</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Content */}
                    <div className="lg:w-2/3">
                        {/* Images */}
                        {tour.images && tour.images.length > 0 && (
                            <div className="mb-12 rounded-2xl overflow-hidden shadow-xl aspect-video relative">
                                <img src={tour.images[0]} alt={tour.name} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Description */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-blue-500 inline-block">Tour Overview</h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                {tour.description}
                            </p>
                        </section>

                        {/* Itinerary */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-8">Itinerary</h2>
                            <div className="space-y-10">
                                {tour.itinerary.map((day) => (
                                    <div key={day.day} className="flex gap-6 relative">
                                        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg z-10">
                                            {day.day}
                                        </div>
                                        <div className="flex-1 pb-10 border-l-2 border-dashed border-blue-200 pl-6 -ml-12 pt-1 mt-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 ml-12">{day.title}</h3>
                                            <p className="text-gray-600 mb-6 ml-12">{day.description}</p>
                                            
                                            {day.activities.length > 0 && (
                                                <div className="ml-12 space-y-4">
                                                    {day.activities.map((activity, idx) => (
                                                        <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                            <span className="text-blue-600 font-bold whitespace-nowrap">{activity.time}</span>
                                                            <span className="text-gray-700">{activity.description}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {day.meals.length > 0 && (
                                                <div className="mt-4 ml-12 flex flex-wrap gap-2 text-sm">
                                                    {day.meals.map((meal, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                                                            🍽️ {meal}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Inclusions / Exclusions */}
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                                <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                                    ✅ What's Included
                                </h3>
                                <ul className="space-y-3">
                                    {tour.inclusions.map((item, idx) => (
                                        <li key={idx} className="text-green-700 flex items-start gap-2">
                                            <span className="pt-1 text-xs">•</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                                <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                                    ❌ What's Not Included
                                </h3>
                                <ul className="space-y-3">
                                    {tour.exclusions.map((item, idx) => (
                                        <li key={idx} className="text-red-700 flex items-start gap-2">
                                            <span className="pt-1 text-xs">•</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-24 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                            <div className="flex justify-between items-end mb-8">
                                <span className="text-gray-500 font-medium">Price per person</span>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-gray-900">₼{tour.pricePerPerson}</span>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all hover:scale-[1.02] shadow-xl shadow-blue-200 mb-6">
                                Book This Adventure
                            </button>

                            <div className="space-y-4 text-sm text-gray-500">
                                <div className="flex items-center gap-3">
                                    <span>🛡️</span> 100% Secure Payment
                                </div>
                                <div className="flex items-center gap-3">
                                    <span>⚡</span> Instant Confirmation
                                </div>
                                <div className="flex items-center gap-3">
                                    <span>📞</span> 24/7 Support
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
