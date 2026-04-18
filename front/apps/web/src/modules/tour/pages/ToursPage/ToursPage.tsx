import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTours } from '../../hooks/useTours';
import { TourCard } from '../../components/TourCard';
import './ToursPage.css';

export const ToursPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const city = searchParams.get('city') || '';
    const { tours, loading, error, refetch, pagination } = useTours({
        city: city || undefined,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch({
            city: city || undefined,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="tour-search-header">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Unforgettable Experiences</h1>
                    <p className="text-gray-600 mb-8">Discover the hidden gems of Karabakh with our curated tours</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4">Filters</h2>


                            <button
                                onClick={handleSearch}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
                                {error}
                            </div>
                        )}

                        {!loading && !error && tours.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No tours found</h3>
                                <p className="text-gray-500">We couldn't find any tours matching your filters.</p>
                            </div>
                        )}

                        {loading && tours.length === 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl"></div>
                                ))}
                            </div>
                        )}

                        {!error && tours.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tours.map((tour) => (
                                        <TourCard
                                            key={tour.id}
                                            tour={tour}
                                            onClick={(id) => navigate(`/tours/${id}`)}
                                        />
                                    ))}
                                </div>

                                {pagination.totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-12 pb-8">
                                        <button
                                            disabled={pagination.page <= 1}
                                            onClick={() => pagination.setPage(pagination.page - 1)}
                                            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${pagination.page <= 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-blue-600 border border-blue-200 hover:border-blue-600 hover:shadow-lg'
                                                }`}
                                        >
                                            ← Prev
                                        </button>

                                        <div className="text-gray-500 font-medium">
                                            Page <span className="text-blue-600 font-bold">{pagination.page}</span> of {pagination.totalPages}
                                        </div>

                                        <button
                                            disabled={pagination.page >= pagination.totalPages}
                                            onClick={() => pagination.setPage(pagination.page + 1)}
                                            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${pagination.page >= pagination.totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-blue-600 border border-blue-200 hover:border-blue-600 hover:shadow-lg'
                                                }`}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
