
import { ContentType } from '@/types';

export interface PromptSection {
  title: string;
  content: string;
}

export interface PromptStructure {
  sections: PromptSection[];
}
