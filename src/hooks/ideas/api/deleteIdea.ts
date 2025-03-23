
import { supabase } from "@/integrations/supabase/client";
import { ContentStatus } from "@/types";

export async function deleteIdea(id: string, userId: string): Promise<void> {
  if (!userId) throw new Error("User not authenticated");

  try {
    console.log(`Changing idea ${id} status to rejected`);
    
    // First, update the idea status to 'rejected' instead of deleting
    const { error: updateError } = await supabase
      .from("content_ideas")
      .update({ status: 'rejected' as ContentStatus })
      .eq("id", id);

    if (updateError) {
      console.error("Error rejecting idea:", updateError);
      throw updateError;
    }

    console.log(`Successfully updated idea ${id} status to rejected`);
    
    // Then, check if we need to clean up old rejected ideas
    await cleanupOldRejectedIdeas(userId);
  } catch (error) {
    console.error("Error in deleteIdea:", error);
    throw error;
  }
}

async function cleanupOldRejectedIdeas(userId: string): Promise<void> {
  // Get count of rejected ideas for this user
  const { count, error: countError } = await supabase
    .from("content_ideas")
    .select("id", { count: 'exact', head: true })
    .eq("user_id", userId)
    .eq("status", 'rejected');

  if (countError) {
    console.error("Error counting rejected ideas:", countError);
    // Continue anyway, as the main operation succeeded
    return;
  }
  
  if (count && count > 100) {
    // If we have more than 100 rejected ideas, delete the oldest ones
    // First, get the IDs of all rejected ideas, sorted by creation date
    const { data: rejectedIdeas, error: fetchError } = await supabase
      .from("content_ideas")
      .select("id, created_at")
      .eq("user_id", userId)
      .eq("status", 'rejected')
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error("Error fetching rejected ideas:", fetchError);
      // Continue anyway, as the main operation succeeded
      return;
    }
    
    if (rejectedIdeas) {
      // Calculate how many we need to delete to get down to 100
      const deleteCount = rejectedIdeas.length - 100;
      if (deleteCount > 0) {
        // Get the IDs of the oldest rejected ideas
        const idsToDelete = rejectedIdeas.slice(0, deleteCount).map(idea => idea.id);
        
        // Delete the oldest rejected ideas
        const { error: deleteError } = await supabase
          .from("content_ideas")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) {
          console.error("Error cleaning up old rejected ideas:", deleteError);
          // Continue anyway, as the main operation succeeded
        }
      }
    }
  }
}
