import { useState, useCallback, useRef } from "react";

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionType extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType;
    webkitSpeechRecognition: new () => SpeechRecognitionType;
  }
}

interface UseVoiceChatOptions {
  onTranscript?: (text: string) => void;
  onSpeechEnd?: (finalText: string) => void;
}

export function useVoiceChat({ onTranscript, onSpeechEnd }: UseVoiceChatOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getElevenLabsKey = useCallback(() => {
    try {
      const settings = localStorage.getItem("content-studio-settings");
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.elevenLabsKey || null;
      }
    } catch {
      return null;
    }
    return null;
  }, []);

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser. Try Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);
      onTranscript?.(currentTranscript);

      if (finalTranscript) {
        onSpeechEnd?.(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscript, onSpeechEnd]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    const elevenLabsKey = getElevenLabsKey();
    
    if (elevenLabsKey) {
      // Use ElevenLabs for high-quality voice
      try {
        setIsSpeaking(true);
        const response = await fetch(
          "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL", // Sarah voice
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": elevenLabsKey,
            },
            body: JSON.stringify({
              text,
              model_id: "eleven_turbo_v2_5",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("ElevenLabs API error");
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      } catch (err) {
        console.error("ElevenLabs error, falling back to browser TTS:", err);
        setIsSpeaking(false);
        // Fall back to browser TTS
        speakWithBrowser(text);
      }
    } else {
      // Use browser's built-in TTS
      speakWithBrowser(text);
    }
  }, [getElevenLabsKey]);

  const speakWithBrowser = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) {
      setError("Text-to-speech is not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes("Samantha") || 
      v.name.includes("Google") || 
      v.lang.startsWith("en")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
