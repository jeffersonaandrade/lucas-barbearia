import { Alert, AlertDescription } from '@/components/ui/alert.jsx';

const AdminAlerts = ({ error, success, className = "mb-6" }) => {
  return (
    <>
      {error && (
        <Alert variant="destructive" className={className}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className={`${className} border-green-200 bg-green-50`}>
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AdminAlerts; 