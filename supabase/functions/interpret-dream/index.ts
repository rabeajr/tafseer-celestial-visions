
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { dreamText } = await req.json();
    
    if (!dreamText) {
      return new Response(
        JSON.stringify({ error: 'Dream text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!googleApiKey) {
      console.error('GOOGLE_AI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Interpreting dream with Google AI...');

    const prompt = `You are a wise and compassionate dream interpreter with expertise in Islamic dream interpretation, psychology, and spiritual symbolism. Please analyze this dream and provide a thoughtful, structured interpretation:

Dream: "${dreamText}"

Please provide your interpretation in the following format:

🌟 **Spiritual Meaning**: 
[Provide spiritual and symbolic interpretation]

🧠 **Psychological Insights**: 
[Explain what this might represent psychologically]

🌙 **Islamic Perspective**: 
[If applicable, provide Islamic dream interpretation context]

✨ **Guidance & Reflection**: 
[Offer gentle guidance and questions for self-reflection]

Keep your response warm, respectful, and encouraging. Focus on positive growth and self-understanding.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google AI API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate interpretation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const interpretation = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!interpretation) {
      console.error('No interpretation received from Google AI');
      return new Response(
        JSON.stringify({ error: 'No interpretation generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Dream interpretation generated successfully');

    return new Response(
      JSON.stringify({ interpretation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in interpret-dream function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
