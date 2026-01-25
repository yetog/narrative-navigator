import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Library as LibraryIcon, 
  Search, 
  Star, 
  Calendar,
  LayoutList,
  GalleryHorizontalEnd,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContentStore } from "@/hooks/useContentStore";
import { ContentItem, purposeStyles } from "@/types/content";
import { format, formatDistanceToNow, parseISO } from "date-fns";

type ViewMode = "timeline" | "carousel";

// Group items by month
function groupByMonth(items: ContentItem[]): { month: string; items: ContentItem[] }[] {
  const grouped: Record<string, ContentItem[]> = {};
  
  items.forEach(item => {
    const date = item.dateToPost || item.createdAt;
    const monthKey = format(parseISO(date), "MMMM yyyy");
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(item);
  });

  return Object.entries(grouped)
    .map(([month, items]) => ({ month, items }))
    .sort((a, b) => {
      const dateA = parseISO(a.items[0].dateToPost || a.items[0].createdAt);
      const dateB = parseISO(b.items[0].dateToPost || b.items[0].createdAt);
      return dateB.getTime() - dateA.getTime();
    });
}

export default function LibraryPage() {
  const { items, toggleStar } = useContentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(new Set());

  // Filter items
  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.idea.toLowerCase().includes(query) ||
      item.text.toLowerCase().includes(query) ||
      item.niche.toLowerCase().includes(query) ||
      item.hashtags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const groupedItems = groupByMonth(filteredItems);

  const toggleMonth = (month: string) => {
    setCollapsedMonths(prev => {
      const next = new Set(prev);
      if (next.has(month)) {
        next.delete(month);
      } else {
        next.add(month);
      }
      return next;
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-glow-teal flex items-center gap-3">
            <LibraryIcon className="w-8 h-8 text-primary" />
            Content Library
          </h1>
          <p className="text-muted-foreground mt-1">Your content timeline and history</p>
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by topic, niche, or hashtag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timeline")}
            >
              <LayoutList className="w-4 h-4 mr-1" />
              Timeline
            </Button>
            <Button
              variant={viewMode === "carousel" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("carousel")}
            >
              <GalleryHorizontalEnd className="w-4 h-4 mr-1" />
              Carousel
            </Button>
          </div>
        </div>

        {/* Content */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <LibraryIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {items.length === 0 
                ? "No content yet. Start brainstorming with the AI assistant!"
                : "No items match your search."
              }
            </p>
          </div>
        ) : viewMode === "timeline" ? (
          <TimelineView 
            groupedItems={groupedItems}
            collapsedMonths={collapsedMonths}
            onToggleMonth={toggleMonth}
            onToggleStar={toggleStar}
          />
        ) : (
          <CarouselView 
            groupedItems={groupedItems}
            onToggleStar={toggleStar}
          />
        )}
      </div>
    </AppLayout>
  );
}

// Timeline View Component
function TimelineView({ 
  groupedItems, 
  collapsedMonths, 
  onToggleMonth,
  onToggleStar 
}: {
  groupedItems: { month: string; items: ContentItem[] }[];
  collapsedMonths: Set<string>;
  onToggleMonth: (month: string) => void;
  onToggleStar: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      {groupedItems.map(({ month, items }) => (
        <div key={month} className="relative">
          {/* Month header */}
          <button
            onClick={() => onToggleMonth(month)}
            className="flex items-center gap-2 mb-4 group"
          >
            {collapsedMonths.has(month) ? (
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
            <h2 className="text-lg font-display font-semibold text-foreground group-hover:text-primary transition-colors">
              {month}
            </h2>
            <Badge variant="secondary" className="text-xs">
              {items.length}
            </Badge>
          </button>

          {/* Timeline items */}
          {!collapsedMonths.has(month) && (
            <div className="relative pl-8 border-l-2 border-border space-y-4">
              {items.map((item, index) => (
                <TimelineItem 
                  key={item.id} 
                  item={item} 
                  onToggleStar={onToggleStar}
                  isFirst={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TimelineItem({ 
  item, 
  onToggleStar,
  isFirst 
}: { 
  item: ContentItem; 
  onToggleStar: (id: string) => void;
  isFirst: boolean;
}) {
  const dateStr = item.dateToPost || item.createdAt;
  const date = parseISO(dateStr);
  
  return (
    <div className="relative group">
      {/* Timeline dot */}
      <div className={cn(
        "absolute -left-[25px] w-3 h-3 rounded-full border-2 transition-colors",
        item.wasPostUploaded 
          ? "bg-primary border-primary" 
          : "bg-card border-border group-hover:border-primary"
      )} />

      {/* Card */}
      <div className={cn(
        "p-4 rounded-xl border border-border bg-gradient-card",
        "hover:border-primary/30 transition-all cursor-pointer group"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground">
                {format(date, "MMM d, yyyy")}
              </span>
              <span className="text-xs text-muted-foreground/50">
                • {formatDistanceToNow(date, { addSuffix: true })}
              </span>
            </div>
            <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
              {item.idea}
            </h3>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(item.id);
            }}
            className={cn(
              "text-muted-foreground hover:text-secondary transition-colors",
              item.starred && "text-secondary"
            )}
          >
            <Star className={cn("w-5 h-5", item.starred && "fill-current")} />
          </button>
        </div>

        {/* Preview text */}
        {item.text && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {item.text}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant="outline" 
              className={cn("text-xs", purposeStyles[item.purpose])}
            >
              {item.purpose}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {item.niche}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {item.wasImageCreated && (
              <span title="Image created">
                <ImageIcon className="w-4 h-4 text-primary" />
              </span>
            )}
            {item.wasPostUploaded && (
              <span title="Posted">
                <ExternalLink className="w-4 h-4 text-secondary" />
              </span>
            )}
          </div>
        </div>

        {/* Hashtags */}
        {item.hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.hashtags.slice(0, 4).map(tag => (
              <span key={tag} className="text-xs text-primary/70">
                #{tag}
              </span>
            ))}
            {item.hashtags.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{item.hashtags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Carousel View Component
function CarouselView({ 
  groupedItems,
  onToggleStar 
}: {
  groupedItems: { month: string; items: ContentItem[] }[];
  onToggleStar: (id: string) => void;
}) {
  return (
    <div className="space-y-8">
      {groupedItems.map(({ month, items }) => (
        <div key={month}>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {month}
          </h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {items.map(item => (
              <CarouselCard 
                key={item.id} 
                item={item} 
                onToggleStar={onToggleStar}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CarouselCard({ 
  item, 
  onToggleStar 
}: { 
  item: ContentItem;
  onToggleStar: (id: string) => void;
}) {
  const dateStr = item.dateToPost || item.createdAt;
  const date = parseISO(dateStr);
  
  return (
    <div className={cn(
      "flex-shrink-0 w-72 p-4 rounded-xl border border-border bg-gradient-card",
      "hover:border-primary/30 transition-all cursor-pointer group"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="text-xs text-muted-foreground">
          {format(date, "MMM d, yyyy")}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(item.id);
          }}
          className={cn(
            "text-muted-foreground hover:text-secondary transition-colors",
            item.starred && "text-secondary"
          )}
        >
          <Star className={cn("w-4 h-4", item.starred && "fill-current")} />
        </button>
      </div>

      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {item.idea}
      </h3>

      {item.text && (
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {item.text}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <Badge 
          variant="outline" 
          className={cn("text-xs", purposeStyles[item.purpose])}
        >
          {item.purpose}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {item.niche}
        </Badge>
      </div>

      {/* Status indicators */}
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        {item.wasImageCreated && (
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-primary" />
            Image
          </span>
        )}
        {item.wasPostUploaded && (
          <span className="flex items-center gap-1 text-secondary">
            <ExternalLink className="w-3 h-3" />
            Posted
          </span>
        )}
      </div>
    </div>
  );
}
