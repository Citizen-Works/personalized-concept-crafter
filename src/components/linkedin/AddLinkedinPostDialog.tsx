
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddLinkedinPostDialogProps {
  addPost: (post: { content: string; url: string | null; tag: string }) => Promise<void>;
}

const AddLinkedinPostDialog: React.FC<AddLinkedinPostDialogProps> = ({ addPost }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostUrl, setNewPostUrl] = useState('');
  const [newPostTag, setNewPostTag] = useState('My post');

  const handleAddPost = async () => {
    if (!newPostContent.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    try {
      await addPost({
        content: newPostContent,
        url: newPostUrl || null,
        tag: newPostTag
      });
      
      // Reset form and close dialog
      setNewPostContent('');
      setNewPostUrl('');
      setNewPostTag('My post');
      setIsOpen(false);
      
      toast.success('LinkedIn post added successfully');
    } catch (error) {
      console.error('Error adding LinkedIn post:', error);
      toast.error('Failed to add LinkedIn post');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1 whitespace-nowrap">
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
          <div className="space-y-2">
            <label htmlFor="post-tag" className="text-sm font-medium">Post Type</label>
            <Select value={newPostTag} onValueChange={setNewPostTag}>
              <SelectTrigger id="post-tag">
                <SelectValue placeholder="Select post type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="My post">My post</SelectItem>
                <SelectItem value="Competitor's post">Competitor's post</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleAddPost}>Add Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLinkedinPostDialog;
