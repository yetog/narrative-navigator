import { useState, useEffect, useCallback } from "react";
import { ContentItem } from "@/types/content";

const STORAGE_KEY = "content-studio-items";

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Sample data to seed the library
const sampleData: ContentItem[] = [
  {
    id: "sample-1",
    purpose: "Educate",
    dateToPost: "2025-01-27",
    type: "post",
    idea: "AI Infrastructure Trends for 2025",
    text: "The infrastructure wars have entered a new phase. Hyperscalers aren't just selling compute anymore - they're selling complete AI development environments.",
    image: "",
    hashtags: ["AI", "Infrastructure", "Cloud", "Tech"],
    niche: "Cloud",
    wasImageCreated: true,
    wasPostUploaded: false,
    createdAt: "2025-01-20T10:00:00Z",
    source: "manual",
    starred: true,
  },
  {
    id: "sample-2",
    purpose: "Attract",
    dateToPost: "2025-01-29",
    type: "post",
    idea: "Why Your Cloud Bill is Too High",
    text: "Most companies are overspending on cloud by 30-40%. Here are 5 quick wins to optimize your infrastructure costs without sacrificing performance.",
    image: "",
    hashtags: ["CloudCosts", "DevOps", "Optimization"],
    niche: "DevOps",
    wasImageCreated: false,
    wasPostUploaded: false,
    createdAt: "2025-01-18T14:00:00Z",
    source: "manual",
    starred: false,
  },
  {
    id: "sample-3",
    purpose: "Announce",
    dateToPost: "2025-01-31",
    type: "post",
    idea: "New Partnership: Kubernetes at Scale",
    text: "Excited to announce our partnership with @KubeCloud! Together we're making enterprise Kubernetes management 10x easier.",
    image: "",
    hashtags: ["Kubernetes", "Partnership", "DevOps", "Cloud"],
    niche: "DevOps",
    wasImageCreated: true,
    wasPostUploaded: true,
    createdAt: "2025-01-15T09:00:00Z",
    source: "manual",
    starred: false,
  },
  {
    id: "sample-4",
    purpose: "Show Off",
    dateToPost: "2025-02-03",
    type: "post",
    idea: "From Junior to Senior: My 5-Year Journey",
    text: "5 years ago I could barely write a for loop. Today I'm architecting systems that serve millions. Here's what actually mattered...",
    image: "",
    hashtags: ["Career", "SoftwareEngineering", "Growth"],
    niche: "Career",
    wasImageCreated: false,
    wasPostUploaded: false,
    createdAt: "2025-01-22T16:00:00Z",
    source: "ai-chat",
    starred: true,
  },
  {
    id: "sample-5",
    purpose: "Educate",
    dateToPost: null,
    type: "idea",
    idea: "API Rate Limiting Best Practices",
    text: "Idea: Cover different rate limiting strategies - token bucket, sliding window, fixed window. Include code examples in Python and Node.",
    image: "",
    hashtags: ["API", "Backend", "Programming"],
    niche: "API",
    wasImageCreated: false,
    wasPostUploaded: false,
    createdAt: "2025-01-24T11:00:00Z",
    source: "ai-chat",
    starred: false,
  },
];

export function useContentStore() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed.length > 0 ? parsed : sampleData);
      } else {
        // Seed with sample data on first load
        setItems(sampleData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
      }
    } catch (error) {
      console.error("Failed to load content from localStorage:", error);
      setItems(sampleData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addItem = useCallback((item: Omit<ContentItem, "id" | "createdAt">) => {
    const newItem: ContentItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<ContentItem>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleStar = useCallback((id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    );
  }, []);

  const importItems = useCallback((newItems: Omit<ContentItem, "id" | "createdAt">[]) => {
    const itemsWithIds: ContentItem[] = newItems.map(item => ({
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }));
    setItems(prev => [...itemsWithIds, ...prev]);
    return itemsWithIds.length;
  }, []);

  const getItemsByDate = useCallback(() => {
    const grouped: Record<string, ContentItem[]> = {};
    
    items.forEach(item => {
      const date = item.dateToPost || item.createdAt.split("T")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });

    // Sort by date descending
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, items]) => ({ date, items }));
  }, [items]);

  return {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    toggleStar,
    importItems,
    getItemsByDate,
  };
}
