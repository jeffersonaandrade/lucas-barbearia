import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';

const AdminModal = ({ 
  trigger, 
  title, 
  children, 
  open, 
  onOpenChange,
  onCancel,
  onConfirm,
  confirmText = "Salvar",
  cancelText = "Cancelar",
  loading = false,
  showFooter = true
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[85vh] sm:max-w-2xl sm:w-auto sm:max-h-[80vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 sm:space-y-4">
          {children}
        </div>
        
        {showFooter && (
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2 sm:pt-4 border-t">
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'Salvando...' : confirmText}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminModal; 