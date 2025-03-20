
import React from 'react';
import { WritingStylePreview } from './WritingStylePreview';
import { WritingStyleProfile } from '@/types';

interface PreviewTabProps {
  writingStyle: Partial<WritingStyleProfile>;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({ writingStyle }) => {
  return <WritingStylePreview writingStyle={writingStyle} />;
};
