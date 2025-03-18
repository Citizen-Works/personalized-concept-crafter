
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface MarketingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (details: MarketingDetails) => Promise<void>;
}

export interface MarketingDetails {
  type: string;
  audience: string;
  purpose: string;
  additionalInstructions?: string;
}

export const MarketingDetailsDialog: React.FC<MarketingDetailsDialogProps> = ({
  open,
  onOpenChange,
  onGenerate
}) => {
  const [details, setDetails] = useState<MarketingDetails>({
    type: 'social',
    audience: 'prospects',
    purpose: 'awareness',
    additionalInstructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleGenerate = async () => {
    setIsSubmitting(true);
    try {
      await onGenerate(details);
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating marketing content:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Marketing Content Details</DialogTitle>
          <DialogDescription>
            Provide details about the marketing content you want to generate.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select
              value={details.type}
              onValueChange={(value) => setDetails({...details, type: value})}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="ad">Advertisement</SelectItem>
                <SelectItem value="website">Website Copy</SelectItem>
                <SelectItem value="brochure">Brochure/Flyer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Select
              value={details.audience}
              onValueChange={(value) => setDetails({...details, audience: value})}
            >
              <SelectTrigger id="audience">
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prospects">New Prospects</SelectItem>
                <SelectItem value="customers">Existing Customers</SelectItem>
                <SelectItem value="industry">Industry Professionals</SelectItem>
                <SelectItem value="general">General Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Content Purpose</Label>
            <Select
              value={details.purpose}
              onValueChange={(value) => setDetails({...details, purpose: value})}
            >
              <SelectTrigger id="purpose">
                <SelectValue placeholder="Select content purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="awareness">Brand Awareness</SelectItem>
                <SelectItem value="leads">Lead Generation</SelectItem>
                <SelectItem value="conversion">Conversion/Sales</SelectItem>
                <SelectItem value="retention">Customer Retention</SelectItem>
                <SelectItem value="education">Customer Education</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Any specific details or instructions..."
              value={details.additionalInstructions}
              onChange={(e) => setDetails({...details, additionalInstructions: e.target.value})}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleGenerate} disabled={isSubmitting}>
            {isSubmitting ? 'Generating...' : 'Generate Content'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
