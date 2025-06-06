import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface InterpretationSections {
  spiritual: string;
  psychological: string;
  islamic: string;
  guidance: string;
}

const Result = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dreamText, setDreamText] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [interpretationSections, setInterpretationSections] = useState<InterpretationSections>({
    spiritual: "",
    psychological: "",
    islamic: "",
    guidance: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showIndividualSections, setShowIndividualSections] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const storedDream = localStorage.getItem('currentDream');
    if (!storedDream) {
      navigate('/home');
      return;
    }
    
    setDreamText(storedDream);
    
    // Check user preferences for interpretation display
    const interpretationType = localStorage.getItem('currentInterpretationType') || 'all';
    const interpretationMode = localStorage.getItem('interpretationMode') || 'all';
    const selectedTypes = JSON.parse(localStorage.getItem('selectedInterpretationTypes') || '{"spiritual":true,"psychological":true,"islamic":true}');
    
    generateInterpretation(storedDream, interpretationType, interpretationMode, selectedTypes);
  }, [navigate, user]);

  const generateInterpretation = async (dream: string, type: string, mode: string, selectedTypes: any) => {
    try {
      setIsLoading(true);
      console.log('Calling interpret-dream function...');
      
      const { data, error } = await supabase.functions.invoke('interpret-dream', {
        body: { dreamText: dream, interpretationType: type }
      });

      if (error) {
        console.error('Error calling function:', error);
        throw error;
      }

      if (data?.interpretation) {
        const fullInterpretation = data.interpretation;
        setInterpretation(fullInterpretation);
        
        // Parse the interpretation into sections
        const sections = parseInterpretation(fullInterpretation);
        setInterpretationSections(sections);
        
        // Determine if we should show individual sections
        if (type !== 'all' || (mode === 'selective' && Object.values(selectedTypes).filter(Boolean).length < 3)) {
          setShowIndividualSections(true);
        }
      } else {
        throw new Error('No interpretation received');
      }

    } catch (error) {
      console.error('Failed to generate interpretation:', error);
      toast({
        title: "Error",
        description: "Failed to interpret your dream. Please try again.",
        variant: "destructive"
      });
      // Fallback to mock interpretation
      const mockInterpretation = generateMockInterpretation(dream);
      setInterpretation(mockInterpretation);
      const sections = parseInterpretation(mockInterpretation);
      setInterpretationSections(sections);
    } finally {
      setIsLoading(false);
    }
  };

  const parseInterpretation = (text: string): InterpretationSections => {
    const sections = {
      spiritual: "",
      psychological: "",
      islamic: "",
      guidance: ""
    };

    // Extract sections using regex
    const spiritualMatch = text.match(/🌟\s*\*\*Spiritual Meaning\*\*:(.*?)(?=🧠|\*\*|$)/s);
    const psychMatch = text.match(/🧠\s*\*\*Psychological Insights\*\*:(.*?)(?=🌙|\*\*|$)/s);
    const islamicMatch = text.match(/🌙\s*\*\*Islamic Perspective\*\*:(.*?)(?=✨|\*\*|$)/s);
    const guidanceMatch = text.match(/✨\s*\*\*Guidance & Reflection\*\*:(.*?)$/s);

    if (spiritualMatch) sections.spiritual = spiritualMatch[1].trim();
    if (psychMatch) sections.psychological = psychMatch[1].trim();
    if (islamicMatch) sections.islamic = islamicMatch[1].trim();
    if (guidanceMatch) sections.guidance = guidanceMatch[1].trim();

    return sections;
  };

  const generateMockInterpretation = (dream: string) => {
    return `🌟 **Spiritual Meaning**: 
Your dream carries profound symbolic meaning, suggesting a period of transformation and self-discovery in your life.

🧠 **Psychological Insights**: 
The elements in your dream often represent your subconscious processing deep emotions and helping you understand your inner world.

🌙 **Islamic Perspective**: 
Dreams are considered a form of divine communication. The symbols in your dream may be guiding you toward spiritual growth and reflection.

✨ **Guidance & Reflection**: 
This dream invites you to reflect on your current path and trust your intuition as you navigate life's journey.

Remember, dreams are deeply personal. Trust your heart as you reflect on how these interpretations resonate with your current situation.`;
  };

  const saveToSupabase = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save dreams.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      console.log('Saving dream to Supabase for user:', user.id);

      // First, save the dream
      const { data: dreamData, error: dreamError } = await supabase
        .from('dreams')
        .insert({
          user_id: user.id,
          title: dreamText.substring(0, 100) + (dreamText.length > 100 ? '...' : ''),
          content: dreamText,
          emotions: [], // You can enhance this later to detect emotions
        })
        .select()
        .single();

      if (dreamError) {
        console.error('Error saving dream:', dreamError);
        throw dreamError;
      }

      console.log('Dream saved successfully:', dreamData);

      // Then, save the interpretation
      const interpretationType = localStorage.getItem('currentInterpretationType') || 'all';
      
      const { data: interpretationData, error: interpretationError } = await supabase
        .from('interpretations')
        .insert({
          dream_id: dreamData.id,
          type: interpretationType,
          spiritual_interpretation: interpretationSections.spiritual || null,
          psychological_interpretation: interpretationSections.psychological || null,
          islamic_interpretation: interpretationSections.islamic || null,
          actionable_insights: interpretationSections.guidance ? [interpretationSections.guidance] : null,
        })
        .select()
        .single();

      if (interpretationError) {
        console.error('Error saving interpretation:', interpretationError);
        throw interpretationError;
      }

      console.log('Interpretation saved successfully:', interpretationData);

      toast({
        title: "Dream Saved! ✨",
        description: "Your dream and interpretation have been saved to your profile.",
      });

      // Clear localStorage after successful save
      localStorage.removeItem('currentDream');
      localStorage.removeItem('currentInterpretationType');

    } catch (error) {
      console.error('Failed to save to Supabase:', error);
      
      // Fallback to localStorage if Supabase fails
      const existingHistory = JSON.parse(localStorage.getItem('dreamHistory') || '[]');
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        dream: dreamText,
        interpretation: interpretation,
        preview: dreamText.substring(0, 100) + '...'
      };
      
      existingHistory.unshift(newEntry);
      localStorage.setItem('dreamHistory', JSON.stringify(existingHistory));
      
      toast({
        title: "Dream Saved Locally! ✨",
        description: "Your interpretation has been saved locally. Please check your connection for cloud sync.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSectionTitle = (type: string) => {
    switch (type) {
      case 'spiritual': return '🌟 Spiritual Meaning';
      case 'psychological': return '🧠 Psychological Insights';
      case 'islamic': return '🌙 Islamic Perspective';
      case 'guidance': return '✨ Guidance & Reflection';
      default: return '';
    }
  };

  const getVisibleSections = () => {
    const interpretationType = localStorage.getItem('currentInterpretationType') || 'all';
    const interpretationMode = localStorage.getItem('interpretationMode') || 'all';
    const selectedTypes = JSON.parse(localStorage.getItem('selectedInterpretationTypes') || '{"spiritual":true,"psychological":true,"islamic":true}');

    if (interpretationType !== 'all') {
      return [interpretationType];
    }

    if (interpretationMode === 'selective') {
      return Object.keys(selectedTypes).filter(key => selectedTypes[key]);
    }

    return ['spiritual', 'psychological', 'islamic', 'guidance'];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dream-gradient flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6">
          <div className="text-6xl animate-gentle-float">🔮</div>
          <h2 className="text-2xl font-bold text-dream-moonlight">Interpreting your dream...</h2>
          <p className="text-dream-softPurple">Our AI is analyzing the symbols and meanings</p>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-dream-lavender rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-dream-softPurple rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-dream-gold rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  const visibleSections = getVisibleSections();

  return (
    <div className="min-h-screen bg-moonlight-gradient flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 bg-dream-gradient">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/home')}
          className="text-dream-moonlight hover:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-dream-moonlight">Your Dream Interpretation</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Your Dream */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm border-dream-lavender/20 rounded-2xl">
          <h3 className="text-dream-midnight font-semibold mb-3 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-dream-lavender" />
            Your Dream
          </h3>
          <p className="text-dream-deepBlue text-sm leading-relaxed">{dreamText}</p>
        </Card>

        {/* Individual Interpretation Sections */}
        {showIndividualSections ? (
          visibleSections.map((sectionType) => (
            interpretationSections[sectionType as keyof InterpretationSections] && (
              <Card key={sectionType} className="p-6 bg-white/90 backdrop-blur-sm border-dream-lavender/20 rounded-2xl">
                <h3 className="text-dream-midnight font-semibold mb-4">
                  {getSectionTitle(sectionType)}
                </h3>
                <div className="text-dream-deepBlue text-sm leading-relaxed whitespace-pre-line">
                  {interpretationSections[sectionType as keyof InterpretationSections]}
                </div>
              </Card>
            )
          ))
        ) : (
          /* Full Interpretation */
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-dream-lavender/20 rounded-2xl">
            <h3 className="text-dream-midnight font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">✨</span>
              AI Interpretation
            </h3>
            <div className="text-dream-deepBlue text-sm leading-relaxed whitespace-pre-line">
              {interpretation}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={saveToSupabase}
            disabled={isSaving}
            className="w-full h-14 bg-dream-lavender hover:bg-dream-deepBlue text-dream-midnight hover:text-dream-moonlight font-semibold rounded-xl transition-all duration-300"
          >
            {isSaving ? '💾 Saving...' : '💾 Save to Profile'}
          </Button>
          
          <Button
            onClick={() => navigate('/home')}
            variant="outline"
            className="w-full h-14 border-dream-lavender text-dream-deepBlue hover:bg-dream-lavender hover:text-dream-midnight font-semibold rounded-xl transition-all duration-300"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;
