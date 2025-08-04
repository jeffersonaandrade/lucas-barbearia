const NotificationSystem = ({ notificacao, onClose }) => {
  if (!notificacao) return null;

  return (
    <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 p-4 rounded-lg shadow-lg max-w-md mx-auto sm:mx-0 ${
      notificacao.tipo === 'success' ? 'bg-green-100 border border-green-400 text-green-800' :
      notificacao.tipo === 'error' ? 'bg-red-100 border border-red-400 text-red-800' :
      'bg-blue-100 border border-blue-400 text-blue-800'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-sm pr-2">{notificacao.mensagem}</span>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 flex-shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationSystem; 