import { useState, useCallback, useRef } from "react";
import { ChatMessage, ChatAttachment } from "@/types/content";

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const SYSTEM_PROMPT = `You are a LinkedIn content strategist assistant for a tech professional. Your role is to:
- Help brainstorm post ideas about topics like Cloud, DevOps, API, Linux, Docker, Web Dev, Security, and AI/ML
- Suggest engaging angles and hooks for LinkedIn posts
- Help refine rough ideas into polished post concepts
- Recommend appropriate content purposes (Educate, Attract, Announce, Show Off, Interest, Aesthetic)
- Keep responses concise and actionable
- Format ideas clearly so they can be saved as content entries

When suggesting a post idea, structure it like:
**Topic:** [The main topic/niche]
**Purpose:** [Educate/Attract/Announce/Show Off/Interest/Aesthetic]
**Hook:** [An attention-grabbing opening line]
**Key Points:** [2-3 bullet points of main content]
**Hashtags:** [3-5 relevant hashtags]

Be creative, engaging, and help create content that stands out on LinkedIn.`;

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getApiKey = useCallback(() => {
    try {
      const settings = localStorage.getItem("content-studio-settings");
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.openaiKey || null;
      }
    } catch {
      return null;
    }
    return null;
  }, []);

  const sendMessage = useCallback(async (
    content: string, 
    attachments: ChatAttachment[] = [], 
    isVoiceInput: boolean = false
  ) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError("Please add your OpenAI API key in Settings first.");
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      attachments: attachments.length > 0 ? attachments : undefined,
      isVoiceInput,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return; // Request was cancelled
      }
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, getApiKey]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    cancelRequest,
  };
}
