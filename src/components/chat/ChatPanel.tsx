import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX, Trash2, Loader2, Sparkles, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { ChatMessage } from "./ChatMessage";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  
  const voiceChat = useVoiceChat({
    onSpeechEnd: (text) => {
      if (text.trim()) {
        sendMessage(text.trim());
      }
    },
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Speak assistant responses in voice mode
  useEffect(() => {
    if (voiceMode && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant" && !isLoading) {
        voiceChat.speak(lastMessage.content);
      }
    }
  }, [messages, voiceMode, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  const toggleVoice = () => {
    if (voiceChat.isListening) {
      voiceChat.stopListening();
    } else {
      voiceChat.startListening();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]",
      "bg-card border border-border rounded-2xl shadow-2xl",
      "flex flex-col overflow-hidden",
      "animate-in slide-in-from-bottom-5 duration-300"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Content Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {voiceMode ? "Voice Mode" : "Text Mode"}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setVoiceMode(!voiceMode)}
            title={voiceMode ? "Switch to text" : "Switch to voice"}
          >
            {voiceMode ? (
              <Volume2 className="w-4 h-4 text-primary" />
            ) : (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={clearChat}
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 h-80" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-primary/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                Hi! I'm your content assistant.
              </p>
              <p className="text-muted-foreground/70 text-xs mt-1">
                Ask me to brainstorm post ideas, refine concepts, or suggest angles for your content.
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          )}
          
          {error && (
            <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Voice indicator */}
      {voiceChat.isListening && (
        <div className="px-4 py-2 bg-primary/10 border-t border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary">
              {voiceChat.transcript || "Listening..."}
            </span>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        {voiceMode ? (
          <div className="flex justify-center">
            <Button
              type="button"
              size="lg"
              className={cn(
                "w-16 h-16 rounded-full p-0 transition-all",
                voiceChat.isListening 
                  ? "bg-destructive hover:bg-destructive/90 glow-teal animate-pulse"
                  : "bg-primary hover:bg-primary/90"
              )}
              onClick={toggleVoice}
            >
              {voiceChat.isListening ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about content ideas..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
