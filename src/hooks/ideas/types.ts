
import { ContentIdea, ContentStatus, ContentType, ContentSource } from "@/types";

export type IdeaCreateInput = Omit<ContentIdea, 'id' | 'userId' | 'createdAt'>;
export type IdeaUpdateInput = Partial<Omit<ContentIdea, 'id' | 'userId' | 'createdAt'>>;
