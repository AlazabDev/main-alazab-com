import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Read API key from Supabase Secrets
    let googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    // إذا لم يكن موجود في Secrets، استخدم المفتاح الجديد
    if (!googleMapsApiKey) {
      googleMapsApiKey = 'AIzaSyBojIb88fGshq8NBXq2qNu-7eEJZwVgGxg';
      console.log('Using fallback Google Maps API key');
    }

    return new Response(
      JSON.stringify({ apiKey: googleMapsApiKey }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error getting Google Maps API key:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get Google Maps API key' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});