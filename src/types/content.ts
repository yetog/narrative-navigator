// Content Studio Data Models

export type Purpose = 
  | "Educate" 
  | "Attract" 
  | "Announce" 
  | "Show Off" 
  | "Interest" 
  | "Aesthetic";

export type ContentSource = 
  | "excel" 
  | "ai-chat" 
  | "manual" 
  | "narrative-engine";

export type ContentType = 
  | "post" 
  | "storyboard" 
  | "prompt" 
  | "voiceover"
  | "idea";

export interface ContentItem {
  id: string;
  purpose: Purpose;
  dateToPost: string | null; // ISO date string
  type: ContentType;
  idea: string; // title/headline
  text: string; // content or Google Doc link
  image: string; // image URL or reference
  hashtags: string[];
  niche: string; // category like "API", "Cloud", "DevOps"
  wasImageCreated: boolean;
  wasPostUploaded: boolean;
  createdAt: string; // ISO date string
  source: ContentSource;
  starred?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
}

// Purpose color mappings for consistent styling
export const purposeStyles: Record<Purpose, string> = {
  "Educate": "bg-primary/20 text-primary border-primary/30",
  "Attract": "bg-secondary/20 text-secondary border-secondary/30",
  "Announce": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Show Off": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Interest": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Aesthetic": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

// Niche/Topic categories from user's Excel
export const niches = [
  "API",
  "Cloud", 
  "DevOps",
  "Web Dev",
  "Linux",
  "Docker",
  "General",
  "Security",
  "AI/ML",
  "Career",
] as const;

export type Niche = typeof niches[number];
