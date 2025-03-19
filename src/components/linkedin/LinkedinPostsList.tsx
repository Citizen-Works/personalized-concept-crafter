
import React from 'react';
import { LinkedinPost } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FileText, Tag, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LinkedinPostsListProps {
  posts: LinkedinPost[];
  handleUpdateTag: (id: string, tag: string) => Promise<void>;
  handleDeletePost: (id: string) => Promise<void>;
}

const LinkedinPostsList: React.FC<LinkedinPostsListProps> = ({
  posts,
  handleUpdateTag,
  handleDeletePost
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
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
          {posts.map((post) => (
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
  );
};

export default LinkedinPostsList;
