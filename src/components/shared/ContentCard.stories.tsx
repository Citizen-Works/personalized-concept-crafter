
import type { Meta, StoryObj } from '@storybook/react';
import { ContentCard } from './ContentCard';
import { Button } from "@/components/ui/button";
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const meta: Meta<typeof ContentCard> = {
  title: 'Components/Shared/ContentCard',
  component: ContentCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    statusType: { 
      control: { type: 'select' }, 
      options: ['content', 'draft'] 
    },
    detailPath: { control: 'text' },
    createdAt: { control: 'date' },
    selectionElement: { control: false },
    isSelected: { control: 'boolean' },
    actions: { control: false },
    children: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof ContentCard>;

// Simple content card with minimal props
export const Basic: Story = {
  args: {
    id: '1',
    title: 'Content Card Title',
    description: 'This is a description of the content card that can be quite long and will be truncated if necessary.',
    createdAt: new Date(),
    detailPath: '/content/1',
  },
};

// Content card with status badge
export const WithStatus: Story = {
  args: {
    ...Basic.args,
    status: 'approved',
    statusType: 'content',
  },
};

// Content card with selection
export const WithSelection: Story = {
  args: {
    ...Basic.args,
    selectionElement: (
      <input 
        type="checkbox" 
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-3 mt-1" 
      />
    ),
    isSelected: true,
  },
};

// Content card with actions
export const WithActions: Story = {
  args: {
    ...Basic.args,
    actions: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
};

// Content card with custom content
export const WithCustomContent: Story = {
  args: {
    ...Basic.args,
    children: (
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2">
          <StatusBadge status="approved" type="content" />
          <StatusBadge status="published" type="draft" />
        </div>
        <p className="text-sm text-muted-foreground">Additional custom content</p>
      </div>
    ),
  },
};

// Full featured content card
export const FullFeatured: Story = {
  args: {
    ...Basic.args,
    status: 'approved',
    statusType: 'content',
    selectionElement: (
      <input 
        type="checkbox" 
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-3 mt-1" 
        checked={true}
        readOnly
      />
    ),
    isSelected: true,
    actions: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    children: (
      <div className="mt-2 bg-muted/20 p-2 rounded">
        <p className="text-sm">Custom content area for additional information</p>
      </div>
    ),
  },
};
