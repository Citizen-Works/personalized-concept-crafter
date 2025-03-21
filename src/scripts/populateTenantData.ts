
import { supabase } from "@/integrations/supabase/client";

/**
 * Script to populate tenant data for existing users
 * This script should be run once after the tenant table is created
 */
export async function populateTenantData() {
  try {
    console.log("Starting tenant data population...");
    
    // Step 1: Get unique email domains from users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id');
    
    if (usersError) throw usersError;
    
    console.log(`Found ${users.length} user profiles`);
    
    // Step 2: Get user emails from auth.users
    // Note: This requires service role permissions
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    console.log(`Found ${authUsers.users.length} authenticated users`);
    
    // Step 3: Extract unique domains
    const domains = new Set<string>();
    for (const user of authUsers.users) {
      if (user.email) {
        const domain = user.email.split('@')[1];
        domains.add(domain);
      }
    }
    
    console.log(`Found ${domains.size} unique domains: ${Array.from(domains).join(', ')}`);
    
    // Step 4: Create tenants for each domain if they don't exist
    for (const domain of domains) {
      // Check if tenant already exists
      const { data: existingTenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('domain', domain)
        .single();
      
      if (existingTenant) {
        console.log(`Tenant for domain ${domain} already exists (ID: ${existingTenant.id})`);
        continue;
      }
      
      // Create new tenant
      const { data: newTenant, error: createError } = await supabase
        .from('tenants')
        .insert([
          { 
            name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1), 
            domain,
            is_active: true,
            settings: {}
          }
        ])
        .select()
        .single();
      
      if (createError) {
        console.error(`Error creating tenant for domain ${domain}:`, createError);
        continue;
      }
      
      console.log(`Created new tenant for domain ${domain} (ID: ${newTenant.id})`);
    }
    
    // Step 5: Update user profiles with tenant IDs
    for (const user of authUsers.users) {
      if (!user.email) continue;
      
      const domain = user.email.split('@')[1];
      
      // Get tenant ID for this domain
      const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('domain', domain)
        .single();
      
      if (!tenant) {
        console.error(`No tenant found for domain ${domain}`);
        continue;
      }
      
      // Update user profile with tenant ID
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ tenant_id: tenant.id })
        .eq('id', user.id);
      
      if (updateError) {
        console.error(`Error updating profile for user ${user.id}:`, updateError);
        continue;
      }
      
      console.log(`Updated profile for user ${user.id} with tenant ID ${tenant.id}`);
    }
    
    console.log("Tenant data population completed successfully");
    return { success: true, message: "Tenant data population completed" };
  } catch (error) {
    console.error("Error in tenant data population:", error);
    return { success: false, error };
  }
}

// Only run the script directly when executed with Node.js, not when imported
if (typeof require !== 'undefined' && require.main === module) {
  populateTenantData()
    .then(result => {
      console.log(result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error("Unhandled error:", error);
      process.exit(1);
    });
}
