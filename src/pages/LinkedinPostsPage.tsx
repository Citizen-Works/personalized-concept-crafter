
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LinkedinIcon, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLinkedinPosts } from '@/hooks/useLinkedinPosts';
import { toast } from 'sonner';

const LinkedinPostsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostUrl, setNewPostUrl] = useState('');
  const { posts, isLoading, addPost, deletePost } = useLinkedinPosts();

  const handleAddPost = async () => {
    if (!newPostContent.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    try {
      await addPost({
        content: newPostContent,
        url: newPostUrl || null
      });
      
      // Reset form and close dialog
      setNewPostContent('');
      setNewPostUrl('');
      setIsAddDialogOpen(false);
      
      toast.success('LinkedIn post added successfully');
    } catch (error) {
      console.error('Error adding LinkedIn post:', error);
      toast.error('Failed to add LinkedIn post');
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
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">LinkedIn Posts</h1>
        <p className="text-muted-foreground">
          Manage your LinkedIn content examples for AI training
        </p>
      </div>

      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add LinkedIn Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add LinkedIn Post Example</DialogTitle>
              <DialogDescription>
                Add a LinkedIn post to help the AI understand your writing style
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="post-content" className="text-sm font-medium">Post Content</label>
                <Textarea
                  id="post-content"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Enter the text of your LinkedIn post..."
                  className="min-h-[200px]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="post-url" className="text-sm font-medium">Post URL (optional)</label>
                <Input
                  id="post-url"
                  value={newPostUrl}
                  onChange={(e) => setNewPostUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/posts/..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddPost}>Add Post</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-muted/20 h-12"></CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted/20 rounded"></div>
                  <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                  <div className="h-4 bg-muted/20 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{post.content}</p>
                {post.url && (
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-500 hover:underline mt-2 block"
                  >
                    View on LinkedIn →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10">
          <LinkedinIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No LinkedIn Posts Added</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-md">
            Add your LinkedIn posts to help the AI understand your writing style and generate better content.
          </p>
        </div>
      )}
    </div>
  );
};

export default LinkedinPostsPage;
