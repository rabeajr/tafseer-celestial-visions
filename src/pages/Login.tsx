
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Simulate login - in real app, would validate credentials
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-soft-gradient flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-4 pb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          className="text-dream-midnight hover:bg-dream-lavender/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-semibold text-dream-midnight">تسجيل الدخول</h2>
        <div className="w-10"></div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dream-midnight mb-2">Welcome Back</h1>
          <p className="text-dream-deepBlue">Continue your dream journey</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-dream-midnight font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-12 rounded-xl border-dream-lavender/30 focus:border-dream-lavender bg-white/80 backdrop-blur-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-dream-midnight font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 rounded-xl border-dream-lavender/30 focus:border-dream-lavender bg-white/80 backdrop-blur-sm"
            />
          </div>

          <Button 
            onClick={handleLogin}
            className="w-full h-14 bg-dream-lavender hover:bg-dream-deepBlue text-dream-midnight hover:text-dream-moonlight font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mt-8"
          >
            Continue
          </Button>

          <div className="text-center pt-4">
            <span className="text-dream-deepBlue text-sm">Don't have an account? </span>
            <Button 
              variant="link" 
              onClick={() => navigate('/signup')}
              className="text-dream-lavender font-semibold p-0 h-auto"
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
