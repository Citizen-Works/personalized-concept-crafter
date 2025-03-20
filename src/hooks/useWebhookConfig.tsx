import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { generateSecureToken } from '@/utils/webhookUtils';

export type WebhookService = "otter" | "fathom" | "read" | "fireflies";

export interface WebhookConfiguration {
  id: string;
  user_id: string;
  service_name: WebhookService;
  is_active: boolean;
  webhook_url: string | null;
  api_key: string | null;
  created_at: string;
  updated_at: string;
  settings: Record<string, any>;
  last_connected: string | null;
}

export const useWebhookConfig = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [copying, setCopying] = useState(false);

  const fetchWebhookConfigurations = async (): Promise<WebhookConfiguration[]> => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("webhook_configurations")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to fetch webhook configurations");
      throw error;
    }

    return data as WebhookConfiguration[];
  };

  const getOrCreateWebhookUrl = async (serviceName: WebhookService): Promise<string> => {
    if (!user) throw new Error("User not authenticated");

    // First check if configuration exists
    const { data: existingConfig, error: fetchError } = await supabase
      .from("webhook_configurations")
      .select("*")
      .eq("user_id", user.id)
      .eq("service_name", serviceName)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 means not found
      toast.error("Error checking webhook configuration");
      throw fetchError;
    }

    // If exists and has URL, return it
    if (existingConfig?.webhook_url) {
      return existingConfig.webhook_url;
    }

    // Generate secure token instead of UUID
    const webhookUrl = generateSecureToken();

    // Create or update configuration
    if (existingConfig) {
      const { error: updateError } = await supabase
        .from("webhook_configurations")
        .update({ 
          webhook_url: webhookUrl,
          updated_at: new Date().toISOString() 
        })
        .eq("id", existingConfig.id);

      if (updateError) {
        toast.error("Failed to update webhook URL");
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from("webhook_configurations")
        .insert({
          user_id: user.id,
          service_name: serviceName,
          webhook_url: webhookUrl,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        toast.error("Failed to create webhook configuration");
        throw insertError;
      }
    }

    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ["webhook-configurations"] });
    
    return webhookUrl;
  };

  const toggleServiceConnection = async (serviceName: WebhookService, isActive: boolean) => {
    if (!user) throw new Error("User not authenticated");

    const { data: existingConfig, error: fetchError } = await supabase
      .from("webhook_configurations")
      .select("*")
      .eq("user_id", user.id)
      .eq("service_name", serviceName)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      toast.error("Error checking service connection");
      throw fetchError;
    }

    if (existingConfig) {
      // Update existing configuration
      const { error: updateError } = await supabase
        .from("webhook_configurations")
        .update({ 
          is_active: isActive,
          last_connected: isActive ? new Date().toISOString() : existingConfig.last_connected
        })
        .eq("id", existingConfig.id);

      if (updateError) {
        toast.error("Failed to update service connection");
        throw updateError;
      }
    } else {
      // Create new configuration with webhook URL
      const webhookUrl = generateSecureToken();
      const { error: insertError } = await supabase
        .from("webhook_configurations")
        .insert({
          user_id: user.id,
          service_name: serviceName,
          webhook_url: webhookUrl,
          is_active: isActive,
          last_connected: isActive ? new Date().toISOString() : null
        });

      if (insertError) {
        toast.error("Failed to create service connection");
        throw insertError;
      }
    }

    toast.success(isActive ? "Service connected successfully" : "Service disconnected");
    queryClient.invalidateQueries({ queryKey: ["webhook-configurations"] });
  };

  const copyWebhookUrl = async (webhookUrl: string) => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(`${window.location.origin}/api/webhook/${webhookUrl}`);
      toast.success("Webhook URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy webhook URL");
      console.error(error);
    } finally {
      setCopying(false);
    }
  };

  const configurationsQuery = useQuery({
    queryKey: ["webhook-configurations", user?.id],
    queryFn: fetchWebhookConfigurations,
    enabled: !!user,
  });

  const getWebhookUrlMutation = useMutation({
    mutationFn: getOrCreateWebhookUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhook-configurations", user?.id] });
    },
  });

  const toggleServiceMutation = useMutation({
    mutationFn: ({ serviceName, isActive }: { serviceName: WebhookService; isActive: boolean }) => 
      toggleServiceConnection(serviceName, isActive),
  });

  return {
    configurations: configurationsQuery.data || [],
    isLoading: configurationsQuery.isLoading,
    isError: configurationsQuery.isError,
    getOrCreateWebhookUrl: getWebhookUrlMutation.mutate,
    toggleServiceConnection: toggleServiceMutation.mutate,
    copyWebhookUrl,
    copying
  };
};
