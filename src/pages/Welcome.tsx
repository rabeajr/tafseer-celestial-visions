import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const Welcome = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-dream-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-dream-gold rounded-full opacity-70 animate-gentle-float"></div>
      <div className="absolute top-40 right-16 w-6 h-6 bg-dream-lavender rounded-full opacity-50 animate-gentle-float" style={{
      animationDelay: '1s'
    }}></div>
      <div className="absolute bottom-32 left-20 w-5 h-5 bg-dream-softPurple rounded-full opacity-60 animate-gentle-float" style={{
      animationDelay: '2s'
    }}></div>
      
      <div className="text-center space-y-8 animate-fade-in max-w-sm w-full">
        {/* App Logo/Title */}
        <div className="space-y-4">
          <div className="text-6xl mb-4">🌙</div>
          <h1 className="text-5xl font-bold text-dream-moonlight mb-2 tracking-wide">
            Tafseer
          </h1>
          <p className="text-dream-softPurple text-lg font-light">
            AI Dream Interpretation
          </p>
          <p className="text-dream-lavender text-sm opacity-80">
            Discover the meanings within your dreams
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-8">
          <Button onClick={() => navigate('/signup')} className="w-full h-14 bg-dream-lavender hover:bg-dream-softPurple text-dream-midnight font-semibold text-lg rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Sign Up
          </Button>
          
          <Button onClick={() => navigate('/login')} variant="outline" className="w-full h-14 border-2 border-dream-lavender hover:bg-dream-lavender font-semibold text-lg rounded-2xl transition-all duration-300 text-gray-700">
            Log In
          </Button>
        </div>

        {/* Subtitle */}
        <p className="text-dream-softPurple text-xs opacity-60 pt-4">
          Begin your journey of dream discovery
        </p>
      </div>
    </div>;
};
export default Welcome;