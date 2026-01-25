import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings, Key, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyConfig {
  key: string;
  name: string;
  description: string;
  placeholder: string;
  storageKey: string;
}

const API_KEYS: ApiKeyConfig[] = [
  {
    key: "openai",
    name: "OpenAI API Key",
    description: "Powers all AI text generation features",
    placeholder: "sk-...",
    storageKey: "openai_api_key",
  },
  {
    key: "elevenlabs",
    name: "ElevenLabs API Key",
    description: "Enables voiceover generation",
    placeholder: "xi-...",
    storageKey: "elevenlabs_api_key",
  },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load saved keys
    const loadedKeys: Record<string, string> = {};
    API_KEYS.forEach(config => {
      const savedKey = localStorage.getItem(config.storageKey);
      if (savedKey) {
        loadedKeys[config.key] = savedKey;
      }
    });
    setKeys(loadedKeys);
  }, []);

  const handleSave = (config: ApiKeyConfig) => {
    const value = keys[config.key];
    if (value?.trim()) {
      localStorage.setItem(config.storageKey, value.trim());
      
      // Also save to unified settings object for hooks
      const settings = JSON.parse(localStorage.getItem("content-studio-settings") || "{}");
      if (config.key === "openai") {
        settings.openaiKey = value.trim();
      } else if (config.key === "elevenlabs") {
        settings.elevenLabsKey = value.trim();
      }
      localStorage.setItem("content-studio-settings", JSON.stringify(settings));
      
      setSaved(prev => ({ ...prev, [config.key]: true }));
      toast({
        title: "API Key Saved",
        description: `${config.name} has been saved securely.`,
      });
      setTimeout(() => {
        setSaved(prev => ({ ...prev, [config.key]: false }));
      }, 2000);
    }
  };

  const handleClear = (config: ApiKeyConfig) => {
    localStorage.removeItem(config.storageKey);
    
    // Also clear from unified settings object
    const settings = JSON.parse(localStorage.getItem("content-studio-settings") || "{}");
    if (config.key === "openai") {
      delete settings.openaiKey;
    } else if (config.key === "elevenlabs") {
      delete settings.elevenLabsKey;
    }
    localStorage.setItem("content-studio-settings", JSON.stringify(settings));
    
    setKeys(prev => ({ ...prev, [config.key]: "" }));
    toast({
      title: "API Key Removed",
      description: `${config.name} has been removed.`,
    });
  };

  const toggleVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isConfigured = (key: string) => !!localStorage.getItem(
    API_KEYS.find(k => k.key === key)?.storageKey || ""
  );

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-glow-teal flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure your API keys and preferences</p>
        </div>

        {/* API Keys */}
        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API Keys
            </CardTitle>
            <CardDescription>
              Your API keys are stored locally in your browser and never sent to our servers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {API_KEYS.map(config => (
              <div key={config.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor={config.key} className="text-base font-medium">
                    {config.name}
                  </Label>
                  {isConfigured(config.key) ? (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <Check className="w-3 h-3" />
                      Configured
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <AlertCircle className="w-3 h-3" />
                      Not configured
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{config.description}</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id={config.key}
                      type={showKeys[config.key] ? "text" : "password"}
                      placeholder={config.placeholder}
                      value={keys[config.key] || ""}
                      onChange={(e) => setKeys(prev => ({ ...prev, [config.key]: e.target.value }))}
                      className="pr-10 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility(config.key)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showKeys[config.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button 
                    onClick={() => handleSave(config)}
                    disabled={!keys[config.key]?.trim()}
                    className={saved[config.key] ? "bg-primary" : ""}
                  >
                    {saved[config.key] ? <Check className="w-4 h-4" /> : "Save"}
                  </Button>
                  {isConfigured(config.key) && (
                    <Button variant="outline" onClick={() => handleClear(config)}>
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Security Note</p>
                <p className="text-sm text-muted-foreground">
                  API keys are stored in your browser's local storage. They are only used to make 
                  direct API calls from your browser and are never transmitted to any third-party servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
