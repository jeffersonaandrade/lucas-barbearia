import { memo } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { useExternalLinks } from '@/hooks/use-external-links.js';

const ActionButton = memo(({
  action,
  messageType,
  customMessage,
  courseTitle,
  courseType,
  url,
  children,
  variant = "default",
  size = "default",
  className = "",
  icon: Icon,
  iconPosition = "left",
  delay = 0,
  onClick,
  ...props
}) => {
  const {
    sendWhatsAppMessage,
    sendCourseMessage,
    openInstagram,
    openCalendly,
    openEmail,
    openLink
  } = useExternalLinks();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Se há um onClick customizado, executa primeiro
    if (onClick) {
      onClick(e);
    }

    // Executa a ação baseada no tipo
    switch (action) {
      case 'whatsapp':
        if (courseTitle) {
          sendCourseMessage(courseTitle, courseType, { delay });
        } else {
          sendWhatsAppMessage(messageType, customMessage, { delay });
        }
        break;
      
      case 'instagram':
        openInstagram({ delay });
        break;
      
      case 'calendly':
        openCalendly({ delay });
        break;
      
      case 'email':
        openEmail({ delay });
        break;
      
      case 'link':
        if (url) {
          openLink(url, { delay });
        }
        break;
      
      default:
        // Se não há ação específica, não faz nada
        break;
    }
  };

  const renderIcon = () => {
    if (!Icon) return null;
    
    const iconElement = <Icon className="w-4 h-4" />;
    
    if (iconPosition === "right") {
      return <span className="ml-2">{iconElement}</span>;
    }
    
    return <span className="mr-2">{iconElement}</span>;
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      onTouchStart={(e) => e.preventDefault()}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
      {...props}
    >
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
    </Button>
  );
});

ActionButton.displayName = 'ActionButton';

export default ActionButton; 