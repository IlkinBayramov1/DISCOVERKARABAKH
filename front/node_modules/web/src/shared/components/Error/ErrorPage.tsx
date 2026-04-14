import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCcw, AlertCircle, MapPinOff } from 'lucide-react';
import './ErrorPage.css';

interface ErrorPageProps {
  status?: number;
  message?: string;
  title?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  status = 404, 
  message, 
  title 
}) => {
  const navigate = useNavigate();

  const is404 = status === 404;
  
  const displayTitle = title || (is404 ? 'Səhifə Tapılmadı' : 'Xəta Baş Verdi');
  const displayMessage = message || (is404 
    ? 'Axtardığınız səhifə mövcud deyil və ya köçürülüb. Zəhmət olmasa ünvanı yoxlayın.' 
    : 'Gözlənilməz bir xəta baş verdi. Texniki komandamız artıq məlumatlandırılıb.');

  return (
    <div className="error-page-container">
      <div className="error-glass-card">
        <div className="error-icon-wrapper">
          {is404 ? (
            <MapPinOff size={64} className="error-icon pulse" />
          ) : (
            <AlertCircle size={64} className="error-icon shake" />
          )}
          <div className="error-status-badge">{status}</div>
        </div>
        
        <h1 className="error-title">{displayTitle}</h1>
        <p className="error-message">{displayMessage}</p>
        
        <div className="error-actions">
          <button 
            className="btn-primary" 
            onClick={() => navigate('/')}
          >
            <Home size={18} className="mr-2" />
            Ana Səhifəyə Qayıt
          </button>
          
          <button 
            className="btn-secondary outline" 
            onClick={() => window.location.reload()}
          >
            <RefreshCcw size={18} className="mr-2" />
            Yenidən Yüklə
          </button>
        </div>
      </div>
      
      <div className="error-bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  );
};

export default ErrorPage;
