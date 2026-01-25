import { User, Sparkles, Save, Mic, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/types/content";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  message: ChatMessageType;
  onSave?: () => void;
}

export function ChatMessage({ message, onSave }: ChatMessageProps) {
  const { toast } = useToast();
  const isUser = message.role === "user";

  const handleSave = () => {
    toast({
      title: "Idea saved!",
      description: "Added to your content library.",
    });
    onSave?.();
  };

  // Simple markdown-like rendering for bold text
  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-primary font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Handle line breaks
      return part.split("\n").map((line, j) => (
        <span key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </span>
      ));
    });
  };

  return (
    <div className={cn(
      "flex gap-3",
      isUser && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
        isUser 
          ? "bg-secondary/20" 
          : "bg-primary/20"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-secondary" />
        ) : (
          <Sparkles className="w-4 h-4 text-primary" />
        )}
      </div>

      {/* Message bubble */}
      <div className={cn(
        "flex-1 max-w-[85%]",
        isUser && "flex flex-col items-end"
      )}>
        {/* Voice indicator */}
        {isUser && message.isVoiceInput && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <Mic className="w-3 h-3" />
            <span>Voice</span>
          </div>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="rounded-lg overflow-hidden border border-border">
                {attachment.type === "image" ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-w-[200px] max-h-[150px] object-cover"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/50">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs truncate max-w-[120px]">{attachment.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm",
          isUser 
            ? "bg-secondary/20 text-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        )}>
          <div className="whitespace-pre-wrap">
            {renderContent(message.content)}
          </div>
        </div>

        {/* Save button for assistant messages */}
        {!isUser && (
          <div className="mt-2 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-primary"
              onClick={handleSave}
            >
              <Save className="w-3 h-3 mr-1" />
              Save as idea
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
