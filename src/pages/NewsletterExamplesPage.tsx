
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, MailIcon, Trash2, Calendar, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNewsletterExamples } from '@/hooks/useNewsletterExamples';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

const NewsletterExamplesPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newExampleContent, setNewExampleContent] = useState('');
  const [newExampleTitle, setNewExampleTitle] = useState('');
  const { examples, isLoading, addExample, deleteExample } = useNewsletterExamples();

  const handleAddExample = async () => {
    if (!newExampleContent.trim()) {
      toast.error('Content cannot be empty');
      return;
    }

    try {
      await addExample({
        title: newExampleTitle || 'Newsletter Example',
        content: newExampleContent
      });
      
      // Reset form and close dialog
      setNewExampleContent('');
      setNewExampleTitle('');
      setIsAddDialogOpen(false);
      
      toast.success('Newsletter example added successfully');
    } catch (error) {
      console.error('Error adding newsletter example:', error);
      toast.error('Failed to add newsletter example');
    }
  };

  const handleDeleteExample = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this example?')) {
      try {
        await deleteExample(id);
        toast.success('Newsletter example deleted successfully');
      } catch (error) {
        console.error('Error deleting example:', error);
        toast.error('Failed to delete example');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Newsletter Examples</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your newsletter examples for AI training
        </p>
      </div>

      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Newsletter Example</span>
              <span className="sm:hidden">Add Example</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Newsletter Example</DialogTitle>
              <DialogDescription>
                Add a newsletter example to help the AI understand your writing style
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="example-title" className="text-sm font-medium">Title (optional)</label>
                <Input
                  id="example-title"
                  value={newExampleTitle}
                  onChange={(e) => setNewExampleTitle(e.target.value)}
                  placeholder="Newsletter Title"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="example-content" className="text-sm font-medium">Content</label>
                <Textarea
                  id="example-content"
                  value={newExampleContent}
                  onChange={(e) => setNewExampleContent(e.target.value)}
                  placeholder="Enter the content of your newsletter example..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddExample}>Add Example</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <Card className="p-8">
          <CardContent className="flex items-center justify-center p-6">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-4 bg-muted/50 rounded w-3/4"></div>
              <div className="h-4 bg-muted/50 rounded"></div>
              <div className="h-4 bg-muted/50 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ) : examples && examples.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-230px)] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead>Title & Content</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="whitespace-nowrap">
                        {format(new Date(example.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{example.title}</div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {example.content}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteExample(example.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 sm:p-12 text-center border rounded-lg bg-muted/10">
          <MailIcon className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
          <h3 className="text-base sm:text-lg font-medium">No Newsletter Examples Added</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 mb-6 max-w-md">
          Save your best-performing newsletter content and inspiring industry examples to help the AI generate engaging newsletters that maintain your consistent voice and resonates with your audience.
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsletterExamplesPage;
