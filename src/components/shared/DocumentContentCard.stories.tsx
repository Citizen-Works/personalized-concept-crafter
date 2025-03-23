
import type { Meta, StoryObj } from '@storybook/react';
import DocumentContentCard from './DocumentContentCard';
import { Document } from '@/types';

const meta: Meta<typeof DocumentContentCard> = {
  title: 'Components/Shared/DocumentContentCard',
  component: DocumentContentCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isProcessing: { control: 'boolean' },
    showIdeasCount: { control: 'boolean' },
    onView: { action: 'viewed' },
    onEdit: { action: 'edited' },
    onArchive: { action: 'archived' },
    onProcess: { action: 'processed' },
    onDelete: { action: 'deleted' },
  },
};

export default meta;

type Story = StoryObj<typeof DocumentContentCard>;

// Sample document data
const sampleDocument: Document = {
  id: 'doc-123',
  userId: 'user-456',
  title: 'Business Marketing Strategy Document',
  content: 'This document outlines our marketing strategy for Q3 2023, including key initiatives, target demographics, and campaign timelines. We will focus on expanding our digital presence while maintaining our traditional marketing channels.',
  type: 'blog',
  purpose: 'business_context',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
  has_ideas: true,
  ideas_count: 5,
};

// Basic document card
export const Basic: Story = {
  args: {
    document: sampleDocument,
  },
};

// Document card showing processing state
export const Processing: Story = {
  args: {
    document: sampleDocument,
    isProcessing: true,
  },
};

// Document card with transcript type
export const Transcript: Story = {
  args: {
    document: {
      ...sampleDocument,
      title: 'Customer Interview Transcript',
      type: 'transcript',
      content: 'Interviewer: Can you tell us about your experience with our product? Customer: I\'ve been using it for about 6 months now and I find it very intuitive. The interface is clean, though I sometimes struggle with the export functionality.',
    },
  },
};

// Document card with no ideas
export const NoIdeas: Story = {
  args: {
    document: {
      ...sampleDocument,
      has_ideas: false,
      ideas_count: 0,
    },
  },
};

// Document card with archived status
export const Archived: Story = {
  args: {
    document: {
      ...sampleDocument,
      status: 'archived',
    },
  },
};

// Document card with writing sample purpose
export const WritingSample: Story = {
  args: {
    document: {
      ...sampleDocument,
      title: 'Thought Leadership Article',
      purpose: 'writing_sample',
      type: 'whitepaper',
    },
  },
};

// Document card with all action handlers
export const WithAllActions: Story = {
  args: {
    document: sampleDocument,
    onView: (doc) => console.log('View document', doc),
    onEdit: (doc) => console.log('Edit document', doc),
    onArchive: (id) => console.log('Archive document', id),
    onProcess: (id) => console.log('Process document', id),
    onDelete: (id) => console.log('Delete document', id),
  },
};
