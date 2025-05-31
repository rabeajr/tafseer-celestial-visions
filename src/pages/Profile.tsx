
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, Moon, Star, Heart } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    // Clear any stored data
    localStorage.removeItem('currentDream');
    await signOut();
    navigate('/');
  };

  const getUserName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  const getUserInitial = () => {
    return getUserName().charAt(0).toUpperCase();
  };

  const stats = [
    { label: "Dreams Interpreted", value: "23", icon: Moon },
    { label: "Days Active", value: "12", icon: Star },
    { label: "Insights Gained", value: "89", icon: Heart },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-moonlight-gradient flex items-center justify-center">
        <div className="text-dream-midnight">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-moonlight-gradient flex flex-col">
      {/* Header */}
      <div className="p-6 pt-12 bg-dream-gradient">
        <div className="text-center space-y-4">
          <Avatar className="h-24 w-24 mx-auto ring-4 ring-dream-lavender">
            <AvatarFallback className="bg-dream-lavender text-dream-midnight font-bold text-2xl">
              {getUserInitial()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-dream-moonlight">{getUserName()}</h1>
            <p className="text-dream-softPurple">Dream Explorer</p>
            <p className="text-dream-softPurple text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 pb-24">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="p-4 bg-white/90 backdrop-blur-sm border-dream-lavender/20 rounded-xl text-center">
                <IconComponent className="h-6 w-6 mx-auto text-dream-lavender mb-2" />
                <div className="text-2xl font-bold text-dream-midnight">{stat.value}</div>
                <div className="text-xs text-dream-deepBlue">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Profile Section */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm border-dream-lavender/20 rounded-2xl">
          <h3 className="text-dream-midnight font-semibold mb-4">About Your Dream Journey</h3>
          <p className="text-dream-deepBlue text-sm leading-relaxed">
            You've been exploring the mystical world of dreams with Ramiel. Each interpretation helps you understand yourself better and connect with your subconscious mind.
          </p>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/settings')}
            variant="outline"
            className="w-full h-14 border-dream-lavender text-dream-deepBlue hover:bg-dream-lavender hover:text-dream-midnight font-semibold rounded-xl transition-all duration-300 justify-start"
          >
            <Settings className="h-5 w-5 mr-3" />
            Interpretation Settings
          </Button>

          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full h-14 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold rounded-xl transition-all duration-300 justify-start"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Log Out
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center space-y-2 pt-6">
          <p className="text-dream-deepBlue text-xs">Ramiel v1.0</p>
          <p className="text-dream-deepBlue/60 text-xs">AI-Powered Dream Interpretation</p>
        </div>
      </div>

      <BottomNavigation currentPage="profile" />
    </div>
  );
};

export default Profile;
