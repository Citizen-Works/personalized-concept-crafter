
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from 'sonner';

// Import our new components
import PageHeader from '@/components/ideas/NewIdea/PageHeader';
import FormFields from '@/components/ideas/NewIdea/FormFields';
import FormActions from '@/components/ideas/NewIdea/FormActions';
import { useNewIdeaForm } from '@/components/ideas/NewIdea/useNewIdeaForm';

const NewIdeaPage = () => {
  const { 
    form,
    isSubmitting, 
    generatingType, 
    onSubmit, 
    onSaveAndGenerate, 
    onCancel 
  } = useNewIdeaForm();
  
  return (
    <div className="space-y-8">
      <PageHeader />
      
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Idea Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormFields form={form} />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <FormActions
                isSubmitting={isSubmitting}
                generatingType={generatingType}
                onCancel={onCancel}
                onSaveAndGenerate={onSaveAndGenerate}
              />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default NewIdeaPage;
