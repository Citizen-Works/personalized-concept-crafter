
import React, { useMemo, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useLinkedinPosts } from '@/hooks/useLinkedinPosts';
import { toast } from 'sonner';
import { 
  LinkedinPostsHeader, 
  EmptyLinkedinPostsState, 
  LinkedinPostsList,
  LinkedinPostsLoading
} from '@/components/linkedin';

const LinkedinPostsPage = () => {
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const { posts, isLoading, addPost, deletePost, updateTag } = useLinkedinPosts();

  // Filter posts by tag if a filter is selected
  const filteredPosts = useMemo(() => {
    if (!tagFilter) return posts;
    return posts.filter(post => post.tag === tagFilter);
  }, [posts, tagFilter]);

  const handleUpdateTag = async (id: string, tag: string) => {
    try {
      await updateTag({ id, tag });
      toast.success('Tag updated successfully');
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error('Failed to update tag');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        toast.success('LinkedIn post deleted successfully');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  return (
    <div className="space-y-6">
      <LinkedinPostsHeader 
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        addPost={addPost}
      />
      
      {isLoading ? (
        <LinkedinPostsLoading />
      ) : filteredPosts && filteredPosts.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <LinkedinPostsList 
              posts={filteredPosts}
              handleUpdateTag={handleUpdateTag}
              handleDeletePost={handleDeletePost}
            />
          </CardContent>
        </Card>
      ) : (
        <EmptyLinkedinPostsState />
      )}
    </div>
  );
};

export default LinkedinPostsPage;
