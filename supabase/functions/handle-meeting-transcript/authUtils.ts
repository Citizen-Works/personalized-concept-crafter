
// Enhanced security: validate token with rate limiting
export async function validateWebhookToken(supabaseAdmin: any, token: string): Promise<any> {
  // Check if token exists
  const { data: config, error: configError } = await supabaseAdmin
    .from('webhook_configurations')
    .select('*')
    .eq('webhook_url', token)
    .single();
  
  if (configError || !config) {
    console.error("Invalid webhook token:", token);
    throw new Error("Invalid webhook token");
  }
  
  // Enhanced security: Rate limiting check
  const timeWindow = new Date();
  timeWindow.setMinutes(timeWindow.getMinutes() - 5); // 5 minute window
  
  const { count, error: countError } = await supabaseAdmin
    .from('webhook_logs')
    .select('*', { count: 'exact', head: true })
    .eq('service_name', config.service_name)
    .eq('user_id', config.user_id)
    .gte('created_at', timeWindow.toISOString());
    
  if (countError) {
    console.error("Error checking rate limit:", countError);
  } else if (count > 10) { // Allow up to 10 requests per 5 minutes
    console.error("Rate limit exceeded for token:", token);
    throw new Error("Rate limit exceeded");
  }
  
  // Check if token is active
  if (!config.is_active) {
    console.error("Webhook token is inactive:", token);
    throw new Error("Webhook token is inactive");
  }
  
  return config;
}
