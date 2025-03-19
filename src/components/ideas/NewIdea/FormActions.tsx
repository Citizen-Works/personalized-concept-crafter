
import React from 'react';
import { Button } from "@/components/ui/button";
import GenerateButtons from './GenerateButtons';
import { ContentType } from '@/types';

type FormActionsProps = {
  isSubmitting: boolean;
  generatingType: ContentType | null;
  onCancel: () => void;
  onSaveAndGenerate: (contentType: ContentType) => Promise<void>;
};

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  generatingType, 
  onCancel,
  onSaveAndGenerate 
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center w-full">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting || !!generatingType}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !!generatingType}
        >
          {isSubmitting ? 'Creating...' : 'Save Idea'}
        </Button>
      </div>
      
      <GenerateButtons 
        isSubmitting={isSubmitting}
        generatingType={generatingType}
        onSaveAndGenerate={onSaveAndGenerate}
      />
    </div>
  );
};

export default FormActions;
