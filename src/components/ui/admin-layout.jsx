import AdminHeader from './admin-header.jsx';
import BackButton from './back-button.jsx';
import AdminAlerts from './admin-alerts.jsx';

const AdminLayout = ({ 
  children, 
  onLogout, 
  onBack, 
  error, 
  success, 
  showBackButton = true,
  maxWidth = "max-w-7xl"
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={onLogout} />
      
      <main className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        {showBackButton && onBack && (
          <BackButton onClick={onBack} />
        )}
        
        <AdminAlerts error={error} success={success} />
        
        {children}
      </main>
    </div>
  );
};

export default AdminLayout; 