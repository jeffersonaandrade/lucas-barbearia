import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';

const DashboardCard = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onButtonClick, 
  buttonVariant = "default",
  className = ""
}) => {
  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="w-5 h-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <Button 
          className="w-full" 
          variant={buttonVariant}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardCard; 