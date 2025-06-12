import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    // Get the request body
    const { provider } = await req.json();
    
    if (!provider) {
      return new Response(
        JSON.stringify({ error: "Provider is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Get the user from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header is required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    
    // Get the Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Verify the user's token and get their ID
    const verifyResponse = await fetch(`${supabaseUrl}/auth/v1/token/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ access_token: token })
    });
    
    if (!verifyResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const verifyData = await verifyResponse.json();
    const userId = verifyData.user.id;
    
    // Get the user's identities
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      }
    });
    
    if (!userResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to get user" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const userData = await userResponse.json();
    const identities = userData.identities || [];
    
    // Check if the user has more than one identity
    if (identities.length <= 1) {
      return new Response(
        JSON.stringify({ error: "Cannot unlink the only identity. Add another login method first." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Find the identity to unlink
    const identityToUnlink = identities.find(identity => identity.provider === provider);
    if (!identityToUnlink) {
      return new Response(
        JSON.stringify({ error: `No ${provider} identity found` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Unlink the identity
    const unlinkResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}/identities/${identityToUnlink.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      }
    });
    
    if (!unlinkResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to unlink provider" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, message: `Successfully unlinked ${provider}` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in unlink-provider function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});