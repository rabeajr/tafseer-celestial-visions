
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Calendar, Clock, Trash2 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

interface DreamEntry {
  id: number;
  date: string;
  dream: string;
  interpretation: string;
  preview: string;
}

const History = () => {
  const [dreamHistory, setDreamHistory] = useState<DreamEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('dreamHistory');
    if (stored) {
      setDreamHistory(JSON.parse(stored));
    }
  }, []);

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

  const deleteDream = (id: number) => {
    const updated = dreamHistory.filter(entry => entry.id !== id);
    setDreamHistory(updated);
    localStorage.setItem('dreamHistory', JSON.stringify(updated));
  };

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
        <h1 className="text-2xl font-bold text-dream-moonlight text-center">Dream History</h1>
        <p className="text-dream-softPurple text-center mt-2">{dreamHistory.length} dreams interpreted</p>
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
