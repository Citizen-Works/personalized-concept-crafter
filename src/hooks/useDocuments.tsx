import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const useDocuments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchDocuments = async (): Promise<Document[]> => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch documents");
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      content: item.content || "",
      type: item.type as Document["type"],
      purpose: item.purpose as Document["purpose"],
      status: item.status as Document["status"],
      content_type: item.content_type as Document["content_type"],
      createdAt: new Date(item.created_at)
    }));
  };

  const createDocument = async (document: Omit<Document, "id" | "userId" | "createdAt">) => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("documents")
      .insert([
        {
          title: document.title,
          content: document.content,
          type: document.type,
          purpose: document.purpose,
          status: document.status,
          content_type: document.content_type,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      toast.error("Failed to create document");
      throw error;
    }

    toast.success("Document created successfully");
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      content: data.content || "",
      type: data.type as Document["type"],
      purpose: data.purpose as Document["purpose"],
      status: data.status as Document["status"],
      content_type: data.content_type as Document["content_type"],
      createdAt: new Date(data.created_at)
    };
  };

  const parseDocumentContent = async (file: File) => {
    const reader = new FileReader();
    
    return new Promise<string>((resolve, reject) => {
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      
      reader.readAsText(file);
    });
  };

  const uploadDocument = async (file: File, documentData: Omit<Document, "id" | "userId" | "content" | "createdAt">) => {
    try {
      setUploadProgress(10);
      
      const content = await parseDocumentContent(file);
      setUploadProgress(50);
      
      const document = await createDocument({
        ...documentData,
        content
      });
      
      setUploadProgress(100);
      toast.success(`Document "${documentData.title}" uploaded successfully`);
      return document;
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
      throw error;
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const updateDocumentStatus = async (id: string, status: 'active' | 'archived') => {
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("documents")
      .update({ status })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update document status");
      throw error;
    }

    toast.success("Document status updated");
  };

  const documentsQuery = useQuery({
    queryKey: ["documents", user?.id],
    queryFn: fetchDocuments,
    enabled: !!user,
  });

  const createDocumentMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", user?.id] });
    },
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: ({ file, documentData }: { 
      file: File; 
      documentData: Omit<Document, "id" | "userId" | "content" | "createdAt"> 
    }) => uploadDocument(file, documentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", user?.id] });
    },
  });

  const updateDocumentStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'archived' }) => 
      updateDocumentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", user?.id] });
    },
  });

  return {
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    isError: documentsQuery.isError,
    createDocument: createDocumentMutation.mutate,
    uploadDocument: uploadDocumentMutation.mutate,
    updateDocumentStatus: updateDocumentStatusMutation.mutate,
    uploadProgress,
  };
};
