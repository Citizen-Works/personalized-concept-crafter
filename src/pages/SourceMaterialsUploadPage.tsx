
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ChevronLeft, FileText, Upload } from "lucide-react";
import UploadDialog from "@/components/source-materials/UploadDialog";
import AddTextDialog from "@/components/source-materials/AddTextDialog";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";

const SourceMaterialsUploadPage = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(true);
  const [addTextDialogOpen, setAddTextDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("upload");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refetch } = useDocuments();
  
  const handleSuccess = () => {
    refetch();
    toast({
      title: "Success",
      description: "Your material has been added to your library.",
    });
    navigate("/source-materials");
  };
  
  React.useEffect(() => {
    if (activeTab === "upload") {
      setUploadDialogOpen(true);
      setAddTextDialogOpen(false);
    } else {
      setAddTextDialogOpen(true);
      setUploadDialogOpen(false);
    }
  }, [activeTab]);
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/source-materials')}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Materials
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Add Source Material</CardTitle>
          <CardDescription>
            Add content to your source materials library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Add Text
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="py-4">
              <p className="text-center text-muted-foreground">
                Upload a document from your computer
              </p>
            </TabsContent>
            <TabsContent value="text" className="py-4">
              <p className="text-center text-muted-foreground">
                Add text content directly to your library
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          setUploadDialogOpen(open);
          if (!open) navigate("/source-materials");
        }}
        onSuccess={handleSuccess}
      />
      
      <AddTextDialog
        open={addTextDialogOpen}
        onOpenChange={(open) => {
          setAddTextDialogOpen(open);
          if (!open) navigate("/source-materials");
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default SourceMaterialsUploadPage;
