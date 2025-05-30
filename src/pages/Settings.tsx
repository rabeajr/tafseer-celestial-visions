
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const [interpretationMode, setInterpretationMode] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState({
    spiritual: true,
    psychological: true,
    islamic: true
  });

  useEffect(() => {
    const savedMode = localStorage.getItem('interpretationMode') || 'all';
    const savedTypes = JSON.parse(localStorage.getItem('selectedInterpretationTypes') || '{"spiritual":true,"psychological":true,"islamic":true}');
    setInterpretationMode(savedMode);
    setSelectedTypes(savedTypes);
  }, []);

  const handleSave = () => {
    localStorage.setItem('interpretationMode', interpretationMode);
    localStorage.setItem('selectedInterpretationTypes', JSON.stringify(selectedTypes));
    toast({
      title: "Settings Saved! ✨",
      description: "Your interpretation preferences have been updated.",
    });
    navigate('/profile');
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    setSelectedTypes(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  return (
    <div className="min-h-screen bg-moonlight-gradient flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 bg-dream-gradient">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/profile')}
          className="text-dream-moonlight hover:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-dream-moonlight">Interpretation Settings</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Interpretation Mode */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm border-dream-lavender/20 rounded-2xl">
          <h3 className="text-dream-midnight font-semibold mb-4 flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2 text-dream-lavender" />
            Interpretation Mode
          </h3>
          
          <RadioGroup value={interpretationMode} onValueChange={setInterpretationMode}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Show all interpretation types</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="selective" id="selective" />
              <Label htmlFor="selective">Show only selected types</Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Interpretation Types */}
        {interpretationMode === 'selective' && (
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-dream-lavender/20 rounded-2xl">
            <h3 className="text-dream-midnight font-semibold mb-4">Select Interpretation Types</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="spiritual"
                  checked={selectedTypes.spiritual}
                  onCheckedChange={(checked) => handleTypeChange('spiritual', checked as boolean)}
                />
                <Label htmlFor="spiritual" className="text-dream-deepBlue">
                  🌟 Spiritual Meaning
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="psychological"
                  checked={selectedTypes.psychological}
                  onCheckedChange={(checked) => handleTypeChange('psychological', checked as boolean)}
                />
                <Label htmlFor="psychological" className="text-dream-deepBlue">
                  🧠 Psychological Insights
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="islamic"
                  checked={selectedTypes.islamic}
                  onCheckedChange={(checked) => handleTypeChange('islamic', checked as boolean)}
                />
                <Label htmlFor="islamic" className="text-dream-deepBlue">
                  🌙 Islamic Perspective
                </Label>
              </div>
            </div>
          </Card>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full h-14 bg-dream-lavender hover:bg-dream-deepBlue text-dream-midnight hover:text-dream-moonlight font-semibold rounded-xl transition-all duration-300"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
