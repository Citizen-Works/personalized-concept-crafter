
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentType } from '@/types';

interface ContentTypeSelectorProps {
  selectedContentType: ContentType;
  onContentTypeChange: (value: ContentType) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ 
  selectedContentType, 
  onContentTypeChange 
}) => {
  return (
    <Tabs 
      defaultValue={selectedContentType} 
      onValueChange={(value) => onContentTypeChange(value as ContentType)}
    >
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
        <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        <TabsTrigger value="marketing">Marketing</TabsTrigger>
      </TabsList>
      
      <TabsContent value="linkedin" className="space-y-4">
        <p className="text-sm text-muted-foreground">Generate a professional LinkedIn post based on this idea.</p>
      </TabsContent>
      <TabsContent value="newsletter" className="space-y-4">
        <p className="text-sm text-muted-foreground">Generate an engaging newsletter article based on this idea.</p>
      </TabsContent>
      <TabsContent value="marketing" className="space-y-4">
        <p className="text-sm text-muted-foreground">Generate compelling marketing copy based on this idea.</p>
      </TabsContent>
    </Tabs>
  );
};

export default ContentTypeSelector;
