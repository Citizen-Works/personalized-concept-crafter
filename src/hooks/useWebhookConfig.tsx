
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { generateSecureToken } from '@/utils/webhookUtils';

export type WebhookService = "otter" | "fathom" | "read" | "fireflies" | "zapier";

export interface WebhookConfiguration {
  id: string;
  user_id: string;
  service_name: WebhookService;
  is_active: boolean | null;
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

  const getOrCreateWebhookUrl = async (serviceName: WebhookService, options?: { 
    onSuccess?: (url: string) => void, 
    onError?: (error: any) => void 
  }): Promise<string> => {
    if (!user) throw new Error("User not authenticated");

    try {
      // First check if configuration exists
      const { data: existingConfig, error: fetchError } = await supabase
        .from("webhook_configurations")
        .select("*")
        .eq("user_id", user.id)
        .eq("service_name", serviceName)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 means not found
        toast.error("Error checking webhook configuration");
        options?.onError?.(fetchError);
        throw fetchError;
      }

      // If exists and has URL, return it
      if (existingConfig?.webhook_url) {
        options?.onSuccess?.(existingConfig.webhook_url);
        return existingConfig.webhook_url;
      }

      // Generate secure token
      const webhookToken = generateSecureToken();

      // Create or update configuration
      if (existingConfig) {
        const { error: updateError } = await supabase
          .from("webhook_configurations")
          .update({ 
            webhook_url: webhookToken,
            updated_at: new Date().toISOString() 
          })
          .eq("id", existingConfig.id);

        if (updateError) {
          toast.error("Failed to update webhook URL");
          options?.onError?.(updateError);
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from("webhook_configurations")
          .insert({
            user_id: user.id,
            service_name: serviceName,
            webhook_url: webhookToken,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          toast.error("Failed to create webhook configuration");
          options?.onError?.(insertError);
          throw insertError;
        }
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["webhook-configurations"] });
      
      options?.onSuccess?.(webhookToken);
      return webhookToken;
    } catch (error) {
      options?.onError?.(error);
      throw error;
    }
  };

  const toggleServiceConnection = async ({ 
    serviceName, 
    isActive,
    zapierWebhookUrl
  }: { 
    serviceName: WebhookService; 
    isActive: boolean;
    zapierWebhookUrl?: string;
  }) => {
    if (!user) throw new Error("User not authenticated");

    try {
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

      // For Zapier, we store the Zapier webhook URL in the settings
      const settings = serviceName === 'zapier' && zapierWebhookUrl 
        ? { zapier_webhook_url: zapierWebhookUrl }
        : existingConfig?.settings || {};

      if (existingConfig) {
        // Update existing configuration
        const { error: updateError } = await supabase
          .from("webhook_configurations")
          .update({ 
            is_active: isActive,
            last_connected: isActive ? new Date().toISOString() : existingConfig.last_connected,
            settings: settings
          })
          .eq("id", existingConfig.id);

        if (updateError) {
          toast.error("Failed to update service connection");
          throw updateError;
        }
      } else {
        // Create new configuration with webhook URL
        let webhookToken = "";
        
        // For Zapier, we don't need a webhook token since the flow is reversed
        if (serviceName !== 'zapier') {
          webhookToken = generateSecureToken();
        }
        
        const { error: insertError } = await supabase
          .from("webhook_configurations")
          .insert({
            user_id: user.id,
            service_name: serviceName,
            webhook_url: webhookToken,
            is_active: isActive,
            last_connected: isActive ? new Date().toISOString() : null,
            settings: settings
          });

        if (insertError) {
          toast.error("Failed to create service connection");
          throw insertError;
        }
      }

      toast.success(isActive ? "Service connected successfully" : "Service disconnected");
      queryClient.invalidateQueries({ queryKey: ["webhook-configurations"] });
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${isActive ? 'connect' : 'disconnect'} service`);
    }
  };

  const copyWebhookUrl = async (webhookUrl: string) => {
    try {
      setCopying(true);
      // Ensure we're copying the full URL
      const fullUrl = webhookUrl.includes('/api/webhook/') 
        ? webhookUrl 
        : `${window.location.origin}/api/webhook/${webhookUrl}`;
        
      await navigator.clipboard.writeText(fullUrl);
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

  return {
    configurations: configurationsQuery.data || [],
    isLoading: configurationsQuery.isLoading,
    isError: configurationsQuery.isError,
    getOrCreateWebhookUrl,
    toggleServiceConnection,
    copyWebhookUrl,
    copying
  };
};
