import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Radio, Plus, Link as LinkIcon, Image, Trash2, Layers } from "lucide-react";
import { useState } from "react";

interface Signal {
  id: string;
  headline: string;
  source?: string;
  notes?: string;
  screenshot?: string;
  createdAt: Date;
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [headline, setHeadline] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedSignals, setSelectedSignals] = useState<Set<string>>(new Set());

  const addSignal = () => {
    if (!headline.trim()) return;
    
    const newSignal: Signal = {
      id: crypto.randomUUID(),
      headline: headline.trim(),
      source: source.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date(),
    };
    
    setSignals(prev => [newSignal, ...prev]);
    setHeadline("");
    setSource("");
    setNotes("");
  };

  const deleteSignal = (id: string) => {
    setSignals(prev => prev.filter(s => s.id !== id));
    setSelectedSignals(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedSignals(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const createBatch = () => {
    // For now, just navigate to create page with selected signals
    // In full implementation, this would store batch in localStorage
    console.log("Creating batch with signals:", Array.from(selectedSignals));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-glow-teal flex items-center gap-3">
              <Radio className="w-8 h-8 text-primary" />
              Signal Collector
            </h1>
            <p className="text-muted-foreground mt-1">Capture headlines, trends, and inspiration</p>
          </div>
          {selectedSignals.size > 0 && (
            <Button onClick={createBatch} className="glow-gold-subtle bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Layers className="w-4 h-4 mr-2" />
              Create Batch ({selectedSignals.size})
            </Button>
          )}
        </div>

        {/* Quick Add Form */}
        <Card className="border-border bg-gradient-card gradient-border">
          <CardHeader>
            <CardTitle className="text-lg">Quick Add Signal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Headline or key observation..."
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="text-lg"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && addSignal()}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Source URL (optional)"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Image className="w-4 h-4" />
                Add Screenshot
              </Button>
            </div>
            <Textarea
              placeholder="Why this matters... (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
            <Button onClick={addSignal} disabled={!headline.trim()} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Signal
            </Button>
          </CardContent>
        </Card>

        {/* Signals List */}
        <div className="space-y-3">
          {signals.length === 0 ? (
            <Card className="border-dashed border-border/50 bg-transparent">
              <CardContent className="py-12 text-center">
                <Radio className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No signals captured yet</p>
                <p className="text-sm text-muted-foreground/70">Add headlines, links, or screenshots above</p>
              </CardContent>
            </Card>
          ) : (
            signals.map(signal => (
              <Card 
                key={signal.id} 
                className={`border-border bg-gradient-card cursor-pointer transition-all ${
                  selectedSignals.has(signal.id) 
                    ? 'border-primary/50 glow-teal-subtle' 
                    : 'hover:border-border/80'
                }`}
                onClick={() => toggleSelect(signal.id)}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      selectedSignals.has(signal.id) 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground/30'
                    }`}>
                      {selectedSignals.has(signal.id) && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{signal.headline}</p>
                      {signal.source && (
                        <a 
                          href={signal.source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                        >
                          <LinkIcon className="w-3 h-3" />
                          {new URL(signal.source).hostname}
                        </a>
                      )}
                      {signal.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{signal.notes}</p>
                      )}
                      <p className="text-xs text-muted-foreground/50 mt-2">
                        {signal.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); deleteSignal(signal.id); }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
