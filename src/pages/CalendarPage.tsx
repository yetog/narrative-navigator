import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Purpose colors
const purposeColors: Record<string, string> = {
  educate: "bg-primary/20 text-primary border-primary/30",
  attract: "bg-secondary/20 text-secondary border-secondary/30",
  announce: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "show-off": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

interface Post {
  id: string;
  date: string;
  title: string;
  purpose: string;
  imageCreated: boolean;
  uploaded: boolean;
}

// Sample data
const samplePosts: Post[] = [
  { id: "1", date: "2025-01-27", title: "AI Infrastructure Trends", purpose: "educate", imageCreated: true, uploaded: false },
  { id: "2", date: "2025-01-29", title: "Cloud Cost Optimization", purpose: "attract", imageCreated: false, uploaded: false },
  { id: "3", date: "2025-01-31", title: "New Partnership Launch", purpose: "announce", imageCreated: true, uploaded: true },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts] = useState<Post[]>(samplePosts);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getPostsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(p => p.date === dateStr);
  };

  const days = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 lg:h-32" />);
  }
  for (let day = 1; day <= totalDays; day++) {
    const dayPosts = getPostsForDay(day);
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    
    days.push(
      <div 
        key={day} 
        className={`h-24 lg:h-32 border border-border rounded-lg p-2 hover:border-primary/50 transition-colors cursor-pointer group ${
          isToday ? 'border-primary/50 bg-primary/5' : ''
        }`}
      >
        <div className="flex justify-between items-start">
          <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
            {day}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <div className="mt-1 space-y-1 overflow-hidden">
          {dayPosts.map(post => (
            <div 
              key={post.id}
              className={`text-xs px-1.5 py-0.5 rounded border truncate ${purposeColors[post.purpose] || ''}`}
            >
              {post.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-glow-teal flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-primary" />
              Content Calendar
            </h1>
            <p className="text-muted-foreground mt-1">Plan and schedule your LinkedIn posts</p>
          </div>
          <Button className="glow-teal-subtle">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Calendar Card */}
        <Card className="border-border bg-gradient-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display">
                {MONTHS[month]} {year}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {days}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
            <span className="text-muted-foreground">Educate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-secondary/20 border border-secondary/30" />
            <span className="text-muted-foreground">Attract</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500/30" />
            <span className="text-muted-foreground">Announce</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-pink-500/20 border border-pink-500/30" />
            <span className="text-muted-foreground">Show Off</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
