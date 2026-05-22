import { Navigate } from 'react-router-dom';
import { getVendorCategory, getToken } from '@/shared/utils/token';

/**
 * A simple redirector component that sends the vendor to their correct 
 * dashboard based on their business category.
 */
export default function DashRedirect() {
    const token = getToken();
    const category = getVendorCategory()?.toLowerCase();

    // If no token, the Layout should have caught it, but double check here
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    switch (category) {
        case 'transport':
            return <Navigate to="/transport/dashboard" replace />;
        case 'tour':
            return <Navigate to="/tours" replace />;
        case 'attraction':
            return <Navigate to="/attractions" replace />;
        case 'restaurant':
            return <Navigate to="/restaurant" replace />;
        case 'event':
            return <Navigate to="/events" replace />;
        case 'gas':
        case 'electricity':
        case 'water':
        case 'utility':
            return <Navigate to="/utility/dashboard" replace />;
        default:
            // Defaulting to hotel if logged in but no specific category found
            return <Navigate to="/hotel/dashboard" replace />;
    }
}
