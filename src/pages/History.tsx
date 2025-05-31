import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Calendar, Clock, Trash2, RefreshCw } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DreamEntry {
  id: string;
  date: string;
  dream: string;
  interpretation: string;
  preview: string;
}

const History = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [dreamHistory, setDreamHistory] = useState<DreamEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      loadDreamHistory();
    }
  }, [user, loading, navigate]);

  const loadDreamHistory = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log('Loading dreams from Supabase for user:', user.id);

      const { data: dreams, error: dreamsError } = await supabase
        .from('dreams')
        .select(`
          id,
          title,
          content,
          created_at,
          interpretations (
            spiritual_interpretation,
            psychological_interpretation,
            islamic_interpretation,
            actionable_insights
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dreamsError) {
        console.error('Error loading dreams:', dreamsError);
        throw dreamsError;
      }

      console.log('Dreams loaded successfully:', dreams);

      // Transform Supabase data to match our interface
      const transformedHistory: DreamEntry[] = dreams?.map(dream => {
        const interpretation = dream.interpretations?.[0];
        let interpretationText = '';
        
        if (interpretation) {
          if (interpretation.spiritual_interpretation) {
            interpretationText += `🌟 **Spiritual Meaning**: ${interpretation.spiritual_interpretation}\n\n`;
          }
          if (interpretation.psychological_interpretation) {
            interpretationText += `🧠 **Psychological Insights**: ${interpretation.psychological_interpretation}\n\n`;
          }
          if (interpretation.islamic_interpretation) {
            interpretationText += `🌙 **Islamic Perspective**: ${interpretation.islamic_interpretation}\n\n`;
          }
          if (interpretation.actionable_insights?.[0]) {
            interpretationText += `✨ **Guidance & Reflection**: ${interpretation.actionable_insights[0]}`;
          }
        }

        return {
          id: dream.id,
          date: dream.created_at,
          dream: dream.content,
          interpretation: interpretationText || 'No interpretation available',
          preview: dream.content.substring(0, 100) + (dream.content.length > 100 ? '...' : '')
        };
      }) || [];

      setDreamHistory(transformedHistory);

    } catch (error) {
      console.error('Failed to load from Supabase, falling back to localStorage:', error);
      
      // Fallback to localStorage
      const stored = localStorage.getItem('dreamHistory');
      if (stored) {
        const localHistory = JSON.parse(stored);
        setDreamHistory(localHistory);
        toast({
          title: "Using Local Data",
          description: "Could not connect to cloud storage. Showing locally saved dreams.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const deleteDream = async (id: string) => {
    if (!user) return;

    try {
      console.log('Deleting dream:', id);

      // First delete interpretations
      const { error: interpretationError } = await supabase
        .from('interpretations')
        .delete()
        .eq('dream_id', id);

      if (interpretationError) {
        console.error('Error deleting interpretation:', interpretationError);
        throw interpretationError;
      }

      // Then delete the dream
      const { error: dreamError } = await supabase
        .from('dreams')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Extra security check

      if (dreamError) {
        console.error('Error deleting dream:', dreamError);
        throw dreamError;
      }

      // Update local state
      setDreamHistory(prev => prev.filter(entry => entry.id !== id));
      
      toast({
        title: "Dream Deleted",
        description: "Your dream has been permanently removed.",
      });

    } catch (error) {
      console.error('Failed to delete from Supabase:', error);
      
      // Fallback to localStorage deletion
      const updated = dreamHistory.filter(entry => entry.id !== id);
      setDreamHistory(updated);
      localStorage.setItem('dreamHistory', JSON.stringify(updated));
      
      toast({
        title: "Dream Deleted Locally",
        description: "Could not delete from cloud storage. Removed locally.",
        variant: "destructive"
      });
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-moonlight-gradient flex flex-col">
        <div className="p-6 pt-12 bg-dream-gradient">
          <h1 className="text-2xl font-bold text-dream-moonlight text-center">Dream History</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
          <div className="text-center space-y-4">
            <RefreshCw className="h-12 w-12 animate-spin text-dream-lavender mx-auto" />
            <h2 className="text-xl font-bold text-dream-midnight">Loading Dreams...</h2>
          </div>
        </div>
        <BottomNavigation currentPage="history" />
      </div>
    );
  }

  if (dreamHistory.length === 0) {
    return (
      <div className="min-h-screen bg-moonlight-gradient flex flex-col">
        {/* Header */}
        <div className="p-6 pt-12 bg-dream-gradient">
          <h1 className="text-2xl font-bold text-dream-moonlight text-center">Dream History</h1>
          <p className="text-dream-softPurple text-center mt-2">Your interpreted dreams</p>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-dream-midnight">No Dreams Yet</h2>
            <p className="text-dream-deepBlue">Your interpreted dreams will appear here</p>
            <Button
              onClick={loadDreamHistory}
              variant="outline"
              className="mt-4 border-dream-lavender text-dream-deepBlue hover:bg-dream-lavender"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <BottomNavigation currentPage="history" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-moonlight-gradient flex flex-col">
      {/* Header */}
      <div className="p-6 pt-12 bg-dream-gradient">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-dream-moonlight">Dream History</h1>
            <p className="text-dream-softPurple mt-2">{dreamHistory.length} dreams interpreted</p>
          </div>
          <Button
            onClick={loadDreamHistory}
            variant="ghost"
            size="icon"
            className="text-dream-moonlight hover:bg-white/20"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Dream List */}
      <div className="flex-1 p-6 space-y-4 pb-24">
        {dreamHistory.map((entry) => (
          <Dialog key={entry.id}>
            <Card className="p-4 bg-white/90 backdrop-blur-sm border-dream-lavender/20 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start">
                <DialogTrigger asChild>
                  <div className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">🌙</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 text-xs text-dream-deepBlue">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(entry.date)}</span>
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(entry.date)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-dream-midnight text-sm leading-relaxed line-clamp-3">
                      {entry.preview}
                    </p>
                    <p className="text-dream-lavender text-xs mt-2 font-medium">Tap to view interpretation</p>
                  </div>
                </DialogTrigger>
                
                <Button
                  onClick={() => deleteDream(entry.id)}
                  variant="ghost"
                  size="icon"
                  className="text-dream-deepBlue hover:text-red-500 hover:bg-red-50 ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <DialogContent className="max-w-sm mx-auto bg-white rounded-2xl border-dream-lavender/20">
              <DialogHeader>
                <DialogTitle className="text-dream-midnight flex items-center">
                  <span className="text-2xl mr-2">🌙</span>
                  Dream from {formatDate(entry.date)}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <h4 className="font-semibold text-dream-midnight mb-2">Your Dream:</h4>
                  <p className="text-dream-deepBlue text-sm leading-relaxed">{entry.dream}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-dream-midnight mb-2">Interpretation:</h4>
                  <div className="text-dream-deepBlue text-sm leading-relaxed whitespace-pre-line">
                    {entry.interpretation}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <BottomNavigation currentPage="history" />
    </div>
  );
};

export default History;
