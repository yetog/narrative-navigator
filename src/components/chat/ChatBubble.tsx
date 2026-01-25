import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./ChatPanel";

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Panel */}
      <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Floating Bubble */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full p-0",
          "bg-primary hover:bg-primary/90 glow-teal",
          "transition-all duration-300 hover:scale-105",
          isOpen && "rotate-90"
        )}
        aria-label={isOpen ? "Close chat" : "Open AI assistant"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
    </>
  );
}
