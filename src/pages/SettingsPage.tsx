import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings, Key, Check, AlertCircle, Eye, EyeOff, Bot, Presentation } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyConfig {
  key: string;
  name: string;
  description: string;
  placeholder: string;
  storageKey: string;
  settingsKey: string;
  icon?: React.ReactNode;
}

const API_KEYS: ApiKeyConfig[] = [
  {
    key: "openai",
    name: "OpenAI API Key",
    description: "Powers all AI text generation features",
    placeholder: "sk-...",
    storageKey: "openai_api_key",
    settingsKey: "openaiKey",
  },
  {
    key: "elevenlabs",
    name: "ElevenLabs API Key",
    description: "Enables high-quality voice synthesis",
    placeholder: "xi-...",
    storageKey: "elevenlabs_api_key",
    settingsKey: "elevenLabsKey",
  },
  {
    key: "elevenlabs_agent",
    name: "ElevenLabs Agent ID",
    description: "Enables conversational AI voice mode",
    placeholder: "agent_...",
    storageKey: "elevenlabs_agent_id",
    settingsKey: "elevenLabsAgentId",
  },
  {
    key: "gamma",
    name: "Gamma API Key",
    description: "Powers presentation and deck generation",
    placeholder: "sk-gamma-...",
    storageKey: "gamma_api_key",
    settingsKey: "gammaKey",
  },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load saved keys from unified settings
    const settings = JSON.parse(localStorage.getItem("content-studio-settings") || "{}");
    const loadedKeys: Record<string, string> = {};
    
    API_KEYS.forEach(config => {
      if (settings[config.settingsKey]) {
        loadedKeys[config.key] = settings[config.settingsKey];
      }
    });
    setKeys(loadedKeys);
  }, []);

  const handleSave = (config: ApiKeyConfig) => {
    const value = keys[config.key];
    if (value?.trim()) {
      // Save to unified settings object
      const settings = JSON.parse(localStorage.getItem("content-studio-settings") || "{}");
      settings[config.settingsKey] = value.trim();
      localStorage.setItem("content-studio-settings", JSON.stringify(settings));
      
      setSaved(prev => ({ ...prev, [config.key]: true }));
      toast({
        title: "API Key Saved",
        description: `${config.name} has been saved.`,
      });
      setTimeout(() => {
        setSaved(prev => ({ ...prev, [config.key]: false }));
      }, 2000);
    }
  };

  const handleClear = (config: ApiKeyConfig) => {
    // Clear from unified settings object
    const settings = JSON.parse(localStorage.getItem("content-studio-settings") || "{}");
    delete settings[config.settingsKey];
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

  const isConfigured = (key: string) => {
    const settings = JSON.parse(localStorage.getItem("content-studio-settings") || "{}");
    const config = API_KEYS.find(k => k.key === key);
    return config ? !!settings[config.settingsKey] : false;
  };

  const getIcon = (key: string) => {
    switch (key) {
      case "elevenlabs_agent":
        return <Bot className="w-4 h-4 text-secondary" />;
      case "gamma":
        return <Presentation className="w-4 h-4 text-purple-400" />;
      default:
        return null;
    }
  };

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
              Your API keys are stored locally in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {API_KEYS.map(config => (
              <div key={config.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor={config.key} className="text-base font-medium flex items-center gap-2">
                    {getIcon(config.key)}
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

        {/* Security Warning */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-destructive">Security Warning</p>
                <p className="text-sm text-muted-foreground">
                  These private API keys are stored in your browser's local storage. They will be visible 
                  in network requests and could be accessed by anyone inspecting your browser. For production 
                  use, consider enabling Lovable Cloud for secure server-side key storage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
