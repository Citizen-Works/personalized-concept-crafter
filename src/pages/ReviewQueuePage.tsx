
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ReviewQueueTab } from "@/components/pipeline/ReviewQueueTab";

const ReviewQueuePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <Button variant="outline" onClick={() => navigate('/pipeline?tab=review')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Pipeline
        </Button>
      </div>
      
      <ReviewQueueTab 
        searchQuery="" 
        dateRange={[undefined, undefined]}
        contentTypeFilter="all"
      />
    </div>
  );
};

export default ReviewQueuePage;
