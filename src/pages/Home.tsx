
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mic } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

const Home = () => {
  const navigate = useNavigate();
  const [dreamText, setDreamText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleInterpret = () => {
    if (dreamText.trim()) {
      // Store dream text for result page
      localStorage.setItem('currentDream', dreamText);
      navigate('/result');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In real app, would implement voice recording
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-dream-gradient flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 ring-2 ring-dream-lavender">
            <AvatarFallback className="bg-dream-lavender text-dream-midnight font-semibold">
              R
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-dream-moonlight text-lg font-semibold">
              {getGreeting()}, Rabea
            </p>
            <p className="text-dream-softPurple text-sm">Ready to explore your dreams?</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-24">
        <div className="max-w-md mx-auto space-y-8 pt-8">
          {/* Dream Input */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-dream-moonlight text-center mb-6">
              What did you dream of?
            </h2>
            
            <div className="relative">
              <Textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="Describe your dream in detail... The more you share, the better the interpretation."
                className="min-h-[120px] p-4 rounded-2xl border-dream-lavender/30 bg-white/90 backdrop-blur-sm text-dream-midnight placeholder:text-dream-deepBlue/60 resize-none focus:ring-2 focus:ring-dream-lavender"
                maxLength={1000}
              />
              
              {/* Voice Input Button */}
              <Button
                onClick={toggleRecording}
                size="icon"
                className={`absolute bottom-3 right-3 h-10 w-10 rounded-full transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-dream-lavender hover:bg-dream-deepBlue text-dream-midnight hover:text-dream-moonlight'
                }`}
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-right">
              <span className="text-dream-softPurple text-xs">
                {dreamText.length}/1000
              </span>
            </div>
          </div>

          {/* Interpret Button */}
          <Button
            onClick={handleInterpret}
            disabled={!dreamText.trim()}
            className="w-full h-16 bg-dream-gold hover:bg-dream-gold/90 text-dream-midnight font-bold text-xl rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✨ Interpret My Dream
          </Button>

          {/* Quick Tips */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-2">
            <h3 className="text-dream-moonlight font-semibold text-sm">💡 Tips for better interpretation:</h3>
            <ul className="text-dream-softPurple text-xs space-y-1">
              <li>• Include emotions you felt</li>
              <li>• Describe colors, people, and places</li>
              <li>• Mention any recurring elements</li>
            </ul>
          </div>
        </div>
      </div>

      <BottomNavigation currentPage="home" />
    </div>
  );
};

export default Home;
