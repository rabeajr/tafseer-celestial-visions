
import { useNavigate } from "react-router-dom";
import { Home, History, UserCircle } from "lucide-react";

interface BottomNavigationProps {
  currentPage: 'home' | 'history' | 'profile';
}

const BottomNavigation = ({ currentPage }: BottomNavigationProps) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, route: '/home' },
    { id: 'history', label: 'History', icon: History, route: '/history' },
    { id: 'profile', label: 'Profile', icon: UserCircle, route: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-dream-lavender/20">
      <div className="flex justify-around items-center py-3 px-6">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'text-dream-lavender bg-dream-lavender/10' 
                  : 'text-dream-deepBlue hover:text-dream-lavender'
              }`}
            >
              <IconComponent className={`h-6 w-6 ${isActive ? 'scale-110' : ''} transition-transform duration-300`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
