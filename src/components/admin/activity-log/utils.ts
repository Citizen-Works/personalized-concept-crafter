
import { 
  PlusCircle, 
  Edit2, 
  Trash2,
  Clock,
} from 'lucide-react';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const getActionIcon = (action: string) => {
  switch(action) {
    case 'create':
      return <PlusCircle className="h-4 w-4 text-green-500" />;
    case 'update':
      return <Edit2 className="h-4 w-4 text-blue-500" />;
    case 'delete':
      return <Trash2 className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

export const getActionBadge = (action: string) => {
  let colorClass = '';
  
  switch(action) {
    case 'create':
      colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      break;
    case 'update':
      colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      break;
    case 'delete':
      colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
  
  return colorClass;
};

export const getEntityName = (type: string) => {
  switch(type) {
    case 'landing_page_content':
      return 'Landing Page';
    case 'prompt_templates':
      return 'Prompt Template';
    default:
      return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

export const getInitials = (name: string) => {
  if (!name || name === 'Unknown') return 'U';
  return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
};
