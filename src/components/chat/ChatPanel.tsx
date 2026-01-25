import { useState, useRef, useEffect } from "react";
import { Send, Volume2, VolumeX, Trash2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { ChatMessage } from "./ChatMessage";
import { VoiceRecordButton } from "./VoiceRecordButton";
import { AttachmentButton } from "./AttachmentButton";
import { AttachmentPreview } from "./AttachmentPreview";
import { ChatAttachment } from "@/types/content";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  
  const voiceChat = useVoiceChat({
    onSpeechEnd: (text) => {
      if (text.trim()) {
        sendMessage(text.trim(), [], true);
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachments.length > 0) && !isLoading) {
      sendMessage(input.trim(), attachments, false);
      setInput("");
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setInput(prev => prev + (prev ? " " : "") + text);
  };

  const handleAttach = (attachment: ChatAttachment) => {
    setAttachments(prev => [...prev, attachment]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => {
      const removed = prev.find(a => a.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter(a => a.id !== id);
    });
  };

  const toggleVoiceMode = () => {
    if (voiceChat.isListening) {
      voiceChat.stopListening();
    }
    setVoiceMode(!voiceMode);
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
            onClick={toggleVoiceMode}
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
                Ask me to brainstorm post ideas, or record a voice note with an idea to refine.
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

      {/* Voice mode indicator */}
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

      {/* Recording indicator */}
      {isRecording && !voiceMode && (
        <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm text-destructive">Recording...</span>
          </div>
        </div>
      )}

      {/* Attachment previews */}
      {attachments.length > 0 && (
        <AttachmentPreview 
          attachments={attachments} 
          onRemove={handleRemoveAttachment}
          compact
        />
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border">
        {voiceMode ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <Button
              type="button"
              size="lg"
              className={cn(
                "w-16 h-16 rounded-full p-0 transition-all",
                voiceChat.isListening 
                  ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                  : "bg-primary hover:bg-primary/90"
              )}
              onClick={() => voiceChat.isListening ? voiceChat.stopListening() : voiceChat.startListening()}
            >
              {voiceChat.isListening ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              {voiceChat.isListening ? "Tap to stop" : "Tap to speak"}
            </p>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            {/* Attachment button */}
            <AttachmentButton 
              onAttach={handleAttach} 
              disabled={isLoading}
            />
            
            {/* Voice record button */}
            <VoiceRecordButton
              onTranscript={handleVoiceTranscript}
              onRecordingChange={setIsRecording}
              disabled={isLoading}
            />
            
            {/* Text input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type or record an idea..."
                disabled={isLoading}
                className="min-h-[40px] max-h-[120px] py-2 pr-10 resize-none"
                rows={1}
              />
            </div>
            
            {/* Send button */}
            <Button 
              type="submit" 
              size="icon"
              className="h-10 w-10"
              disabled={(!input.trim() && attachments.length === 0) || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
