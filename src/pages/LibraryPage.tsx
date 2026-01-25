import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Library as LibraryIcon, Search, Star, FileText, Image, Mic, Filter } from "lucide-react";
import { useState } from "react";

interface LibraryItem {
  id: string;
  title: string;
  type: "post" | "storyboard" | "prompt" | "voiceover";
  tags: string[];
  starred: boolean;
  createdAt: Date;
  preview: string;
}

const sampleItems: LibraryItem[] = [
  {
    id: "1",
    title: "Infrastructure Wars Analysis",
    type: "post",
    tags: ["Compute", "AI Agents"],
    starred: true,
    createdAt: new Date("2025-01-20"),
    preview: "The infrastructure wars have entered a new phase. Hyperscalers aren't just selling compute anymore..."
  },
  {
    id: "2",
    title: "Cloud Power Dynamics Storyboard",
    type: "storyboard",
    tags: ["Cloud Risk", "Infrastructure"],
    starred: false,
    createdAt: new Date("2025-01-18"),
    preview: "4-panel storyboard about the shift in compute infrastructure control..."
  },
  {
    id: "3",
    title: "DC Comics Data Center Prompt",
    type: "prompt",
    tags: ["Infrastructure"],
    starred: true,
    createdAt: new Date("2025-01-15"),
    preview: "DC Comics style illustration, dramatic perspective, massive futuristic data center interior..."
  },
];

const typeIcons = {
  post: FileText,
  storyboard: LibraryIcon,
  prompt: Image,
  voiceover: Mic,
};

const typeColors = {
  post: "bg-secondary/20 text-secondary",
  storyboard: "bg-primary/20 text-primary",
  prompt: "bg-purple-500/20 text-purple-400",
  voiceover: "bg-pink-500/20 text-pink-400",
};

export default function LibraryPage() {
  const [items] = useState<LibraryItem[]>(sampleItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = !activeFilter || item.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-glow-teal flex items-center gap-3">
            <LibraryIcon className="w-8 h-8 text-primary" />
            Content Library
          </h1>
          <p className="text-muted-foreground mt-1">Your saved narratives, posts, and templates</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(null)}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "post" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("post")}
            >
              <FileText className="w-4 h-4 mr-1" />
              Posts
            </Button>
            <Button
              variant={activeFilter === "storyboard" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("storyboard")}
            >
              <LibraryIcon className="w-4 h-4 mr-1" />
              Storyboards
            </Button>
            <Button
              variant={activeFilter === "prompt" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("prompt")}
            >
              <Image className="w-4 h-4 mr-1" />
              Prompts
            </Button>
          </div>
        </div>

        {/* Library Grid */}
        {filteredItems.length === 0 ? (
          <Card className="border-dashed border-border/50 bg-transparent">
            <CardContent className="py-12 text-center">
              <LibraryIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No items found</p>
              <p className="text-sm text-muted-foreground/70">Create content to add to your library</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => {
              const TypeIcon = typeIcons[item.type];
              return (
                <Card 
                  key={item.id} 
                  className="border-border bg-gradient-card hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${typeColors[item.type]} flex items-center justify-center`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <button className={`text-muted-foreground hover:text-secondary transition-colors ${item.starred ? 'text-secondary' : ''}`}>
                        <Star className={`w-5 h-5 ${item.starred ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {item.preview}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-xs text-muted-foreground/50">
                      {item.createdAt.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
