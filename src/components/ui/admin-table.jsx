import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Edit, Trash2, Users } from 'lucide-react';

const AdminTable = ({
  items = [],
  renderItem,
  emptyIcon: EmptyIcon = Users,
  emptyTitle = "Nenhum item encontrado",
  emptyMessage = "Comece adicionando o primeiro item",
  emptyCondition = null,
  className = "grid gap-6"
}) => {
  const isEmpty = emptyCondition !== null ? emptyCondition : items.length === 0;

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <EmptyIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {emptyTitle}
          </h3>
          <p className="text-muted-foreground">
            {emptyMessage}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {items.map(renderItem)}
    </div>
  );
};

// Componente auxiliar para cards de item
export const AdminTableCard = ({
  item,
  icon: Icon = Users,
  title,
  subtitle,
  badges = [],
  actions = [],
  className = "hover:shadow-md transition-shadow"
}) => {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{title}</h3>
                {badges.map((badge, index) => (
                  <Badge key={index} className={badge.color} variant={badge.variant}>
                    {badge.label}
                  </Badge>
                ))}
              </div>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                {subtitle}
              </div>
            </div>
          </div>
          
          {actions.length > 0 && (
            <div className="flex items-center space-x-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || "outline"}
                  size="sm"
                  className={`flex items-center space-x-2 ${action.className || ""}`}
                  disabled={action.disabled}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTable; 