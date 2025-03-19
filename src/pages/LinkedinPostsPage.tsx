
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LinkedinIcon, Trash2, Calendar, FileText, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLinkedinPosts } from '@/hooks/useLinkedinPosts';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LinkedinPostsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostUrl, setNewPostUrl] = useState('');
  const [newPostTag, setNewPostTag] = useState('My post');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const { posts, isLoading, addPost, deletePost, updateTag } = useLinkedinPosts();

  // Filter posts by tag if a filter is selected
  const filteredPosts = useMemo(() => {
    if (!tagFilter) return posts;
    return posts.filter(post => post.tag === tagFilter);
  }, [posts, tagFilter]);

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
      setIsAddDialogOpen(false);
      
      toast.success('LinkedIn post added successfully');
    } catch (error) {
      console.error('Error adding LinkedIn post:', error);
      toast.error('Failed to add LinkedIn post');
    }
  };

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTagBadgeColor = (tag: string) => {
    switch (tag) {
      case 'My post':
        return 'bg-blue-500 hover:bg-blue-600';
      case "Competitor's post":
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">LinkedIn Posts</h1>
        <p className="text-muted-foreground">
          Manage your LinkedIn content examples for AI training
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto max-w-xs">
          <Select value={tagFilter || ''} onValueChange={(value) => setTagFilter(value || null)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All posts</SelectItem>
              <SelectItem value="My post">My posts</SelectItem>
              <SelectItem value="Competitor's post">Competitor's posts</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddPost}>Add Post</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <Card className="animate-pulse">
          <CardHeader className="bg-muted/20 h-12"></CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="h-4 bg-muted/20 rounded"></div>
              <div className="h-4 bg-muted/20 rounded w-3/4"></div>
              <div className="h-4 bg-muted/20 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ) : filteredPosts && filteredPosts.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-230px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] md:w-[180px]">Date</TableHead>
                    <TableHead className="min-w-[120px]">Type</TableHead>
                    <TableHead>Content Preview</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
                          <span className="line-clamp-1">{formatDate(post.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={post.tag} 
                          onValueChange={(value) => handleUpdateTag(post.id, value)}
                        >
                          <SelectTrigger className="h-8 w-full">
                            <div className="flex items-center gap-2">
                              <Tag className={`h-3 w-3 ${post.tag === "My post" ? "text-blue-500" : "text-purple-500"}`} />
                              <span className="truncate">{post.tag}</span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="My post">My post</SelectItem>
                            <SelectItem value="Competitor's post">Competitor's post</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0 hidden sm:block" />
                          <div>
                            <p className="line-clamp-2 text-sm">{post.content}</p>
                            {post.url && (
                              <a 
                                href={post.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs sm:text-sm text-blue-500 hover:underline mt-1 inline-block"
                              >
                                View on LinkedIn →
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePost(post.id)} 
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
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
