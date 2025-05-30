
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Result = () => {
  const navigate = useNavigate();
  const [dreamText, setDreamText] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedDream = localStorage.getItem('currentDream');
    if (!storedDream) {
      navigate('/home');
      return;
    }
    
    setDreamText(storedDream);
    
    // Simulate AI interpretation loading
    setTimeout(() => {
      setInterpretation(generateMockInterpretation(storedDream));
      setIsLoading(false);
    }, 2000);
  }, [navigate]);

  const generateMockInterpretation = (dream: string) => {
    return `Your dream carries profound symbolic meaning. The elements you described suggest a period of transformation and self-discovery in your life.

The imagery in your dream often represents:

🌟 **Personal Growth**: The symbols suggest you're entering a phase of spiritual awakening and personal development.

🌙 **Emotional Insights**: Your subconscious is processing deep emotions and helping you understand your inner world.

✨ **Future Guidance**: This dream may be preparing you for upcoming opportunities or challenges.

Remember, dreams are deeply personal. Trust your intuition as you reflect on how these interpretations resonate with your current life situation.`;
  };

  const saveToHistory = () => {
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
      title: "Dream Saved! ✨",
      description: "Your interpretation has been added to your history.",
    });
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

        {/* Interpretation */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm border-dream-lavender/20 rounded-2xl">
          <h3 className="text-dream-midnight font-semibold mb-4 flex items-center">
            <span className="text-2xl mr-2">✨</span>
            Interpretation
          </h3>
          <div className="text-dream-deepBlue text-sm leading-relaxed whitespace-pre-line">
            {interpretation}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={saveToHistory}
            className="w-full h-14 bg-dream-lavender hover:bg-dream-deepBlue text-dream-midnight hover:text-dream-moonlight font-semibold rounded-xl transition-all duration-300"
          >
            💾 Save to History
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
