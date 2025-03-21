
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddLinkedinPostDialog from './AddLinkedinPostDialog';
import { UseMutateFunction } from '@tanstack/react-query';
import { LinkedinPost } from '@/types/content';

interface LinkedinPostsHeaderProps {
  tagFilter: string | null;
  setTagFilter: (value: string | null) => void;
  addPost: UseMutateFunction<LinkedinPost, Error, { content: string; url: string | null; tag: string; }, unknown>;
}

const LinkedinPostsHeader: React.FC<LinkedinPostsHeaderProps> = ({ 
  tagFilter, 
  setTagFilter, 
  addPost 
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">LinkedIn Posts</h1>
      <p className="text-muted-foreground">
        Manage your LinkedIn content examples for AI training
      </p>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <div className="w-full sm:w-auto max-w-xs">
          <Select value={tagFilter || 'all'} onValueChange={(value) => setTagFilter(value === 'all' ? null : value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All posts</SelectItem>
              <SelectItem value="My post">My posts</SelectItem>
              <SelectItem value="Competitor's post">Competitor's posts</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <AddLinkedinPostDialog addPost={addPost} />
      </div>
    </div>
  );
};

export default LinkedinPostsHeader;
