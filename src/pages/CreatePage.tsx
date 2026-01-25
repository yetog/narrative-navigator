import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wand2, 
  Sparkles, 
  BookOpen, 
  Image, 
  FileText,
  Mic,
  Presentation,
  Play,
  Copy,
  Check,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface StoryboardPanel {
  title: string;
  visual: string;
  symbolism: string;
  emotion: string;
}

interface GeneratedContent {
  narrative?: string;
  storyboard?: StoryboardPanel[];
  imagePrompts?: string[];
  posts?: {
    short: string;
    medium: string;
    long: string;
  };
  voiceoverScript?: string;
  gammaOutline?: string;
}

export default function CreatePage() {
  const { toast } = useToast();
  const [signalInput, setSignalInput] = useState("");
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [content, setContent] = useState<GeneratedContent>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const hasOpenAIKey = !!localStorage.getItem("openai_api_key");
  const hasElevenLabsKey = !!localStorage.getItem("elevenlabs_api_key");

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generateNarrative = async () => {
    if (!hasOpenAIKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key in Settings",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating("narrative");
    // Simulated for now - will connect to OpenAI
    setTimeout(() => {
      setContent(prev => ({
        ...prev,
        narrative: `The underlying story here is about the shift in compute infrastructure control. Major cloud providers are consolidating power through custom silicon, while AI companies scramble for GPU access.\n\nWho's gaining power: Hyperscalers with vertical integration capabilities.\n\nWhat's becoming scarce: Access to cutting-edge AI training infrastructure outside the major clouds.\n\nWhy it matters now: The next wave of AI capabilities will be gated by infrastructure access, not just research breakthroughs.`
      }));
      setIsGenerating(null);
    }, 2000);
  };

  const generateStoryboard = async () => {
    if (!content.narrative) {
      toast({
        title: "Generate Narrative First",
        description: "Extract the narrative before generating a storyboard",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating("storyboard");
    setTimeout(() => {
      setContent(prev => ({
        ...prev,
        storyboard: [
          { title: "The Power Grid", visual: "Massive data center with glowing servers", symbolism: "Current state of cloud infrastructure", emotion: "Awe/Scale" },
          { title: "The Gatekeepers", visual: "Three titans holding keys to a vault", symbolism: "Hyperscaler control over compute", emotion: "Tension" },
          { title: "The Scramble", visual: "Smaller figures reaching for scattered chips", symbolism: "AI companies competing for access", emotion: "Urgency" },
          { title: "The New Order", visual: "Vertical tower with integrated layers", symbolism: "Vertical integration as moat", emotion: "Inevitability" },
        ]
      }));
      setIsGenerating(null);
    }, 2000);
  };

  const generateImagePrompts = async () => {
    if (!content.storyboard) {
      toast({
        title: "Generate Storyboard First",
        description: "Create a storyboard before generating image prompts",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating("prompts");
    setTimeout(() => {
      setContent(prev => ({
        ...prev,
        imagePrompts: [
          "DC Comics style illustration, dramatic perspective, massive futuristic data center interior, rows of glowing server racks stretching to infinity, deep shadows and teal accent lighting, high contrast, bold linework, cinematic composition, 16:9 aspect ratio",
          "DC Comics style illustration, three imposing figures in dark suits standing before an enormous vault door, dramatic lighting from behind, long shadows, power and authority emanating, gritty futuristic aesthetic, bold inks",
          "DC Comics style illustration, chaotic scene of smaller figures desperately grabbing at floating microchips in the air, dynamic motion lines, urgency and competition, dark background with gold accent highlights",
          "DC Comics style illustration, monolithic tower composed of integrated tech layers - chips, servers, cables - rising through clouds, god rays breaking through, sense of unstoppable momentum, dramatic vertical composition",
        ]
      }));
      setIsGenerating(null);
    }, 2000);
  };

  const generatePosts = async () => {
    if (!content.narrative) {
      toast({
        title: "Generate Narrative First",
        description: "Extract the narrative before generating posts",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating("posts");
    setTimeout(() => {
      setContent(prev => ({
        ...prev,
        posts: {
          short: `The infrastructure wars have entered a new phase.\n\nHyperscalers aren't just selling compute anymore.\n\nThey're building moats through vertical integration.\n\nCustom silicon. Private networks. Captive AI workloads.\n\nThe question isn't who has the best AI.\n\nIt's who controls the infrastructure to run it.`,
          medium: `Something shifted in cloud infrastructure this quarter.\n\nWatch the silicon announcements closely. Custom chips from every major player. Each one a strategic move, not a product launch.\n\nThe pattern: vertical integration as competitive moat.\n\nWhen you control the chip, the server, the network, and the software—you control the customer's options.\n\nFor AI companies without cloud-scale resources, this creates an uncomfortable dependency. Your breakthrough model needs their infrastructure to run.\n\nSecond-order effect worth watching: which AI labs start building their own hardware programs?`,
          long: `I spent last week analyzing quarterly infrastructure announcements from the major cloud providers.\n\nOne pattern kept emerging.\n\nThree years ago, cloud was about renting compute. Standard chips, commodity hardware, compete on price and features.\n\nToday? Each hyperscaler is racing to build an integrated stack that's impossible to replicate.\n\nCustom AI accelerators designed for their specific workloads. Network architectures optimized for their chip designs. Software frameworks that extract maximum performance from their hardware.\n\nThe result is a narrowing funnel.\n\nIf you're training large AI models, your realistic options are shrinking. The infrastructure required exists in perhaps four places globally.\n\nThis isn't about better technology. It's about structural control over the AI compute layer.\n\nThe companies building the most capable AI systems will increasingly be the ones who control—or have privileged access to—the infrastructure those systems require.\n\nWatch what the well-funded AI labs do next. The smart ones are already thinking about their infrastructure independence.`
        }
      }));
      setIsGenerating(null);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-glow-teal flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-primary" />
            Narrative Engine
          </h1>
          <p className="text-muted-foreground mt-1">Transform signals into compelling LinkedIn content</p>
        </div>

        {/* Input Section */}
        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">Input Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your signals, headlines, or observations here..."
              value={signalInput}
              onChange={(e) => setSignalInput(e.target.value)}
              rows={4}
              className="mb-4"
            />
            <p className="text-sm text-muted-foreground">
              Or select signals from your <a href="/signals" className="text-primary hover:underline">Signal Collector</a>
            </p>
          </CardContent>
        </Card>

        {/* Generation Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border bg-gradient-card hover:border-primary/30 transition-colors">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Step 1</h3>
                  <p className="text-sm text-muted-foreground">Extract Narrative</p>
                </div>
                <Button 
                  onClick={generateNarrative} 
                  disabled={isGenerating !== null || !signalInput.trim()}
                  className="w-full"
                >
                  {isGenerating === "narrative" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-card hover:border-primary/30 transition-colors">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Step 2</h3>
                  <p className="text-sm text-muted-foreground">Generate Storyboard</p>
                </div>
                <Button 
                  onClick={generateStoryboard} 
                  disabled={isGenerating !== null || !content.narrative}
                  variant={content.narrative ? "default" : "secondary"}
                  className="w-full"
                >
                  {isGenerating === "storyboard" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-card hover:border-primary/30 transition-colors">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
                  <Image className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Step 3</h3>
                  <p className="text-sm text-muted-foreground">Image Prompts</p>
                </div>
                <Button 
                  onClick={generateImagePrompts} 
                  disabled={isGenerating !== null || !content.storyboard}
                  variant={content.storyboard ? "default" : "secondary"}
                  className="w-full"
                >
                  {isGenerating === "prompts" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-card hover:border-primary/30 transition-colors">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Step 4</h3>
                  <p className="text-sm text-muted-foreground">LinkedIn Posts</p>
                </div>
                <Button 
                  onClick={generatePosts} 
                  disabled={isGenerating !== null || !content.narrative}
                  variant={content.narrative ? "default" : "secondary"}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  {isGenerating === "posts" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Tabs */}
        {(content.narrative || content.storyboard || content.imagePrompts || content.posts) && (
          <Card className="border-border bg-gradient-card">
            <CardContent className="pt-6">
              <Tabs defaultValue="narrative" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="narrative" disabled={!content.narrative}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Narrative
                  </TabsTrigger>
                  <TabsTrigger value="storyboard" disabled={!content.storyboard}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Storyboard
                  </TabsTrigger>
                  <TabsTrigger value="prompts" disabled={!content.imagePrompts}>
                    <Image className="w-4 h-4 mr-2" />
                    Prompts
                  </TabsTrigger>
                  <TabsTrigger value="posts" disabled={!content.posts}>
                    <FileText className="w-4 h-4 mr-2" />
                    Posts
                  </TabsTrigger>
                  <TabsTrigger value="voice" disabled={!content.voiceoverScript}>
                    <Mic className="w-4 h-4 mr-2" />
                    Voice
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="narrative" className="space-y-4">
                  {content.narrative && (
                    <div className="relative">
                      <pre className="whitespace-pre-wrap text-sm bg-muted/30 rounded-lg p-4 font-sans">
                        {content.narrative}
                      </pre>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(content.narrative!, "narrative")}
                      >
                        {copiedField === "narrative" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="storyboard" className="space-y-4">
                  {content.storyboard && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.storyboard.map((panel, i) => (
                        <Card key={i} className="border-border/50 bg-muted/20">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 text-primary font-bold">
                                {i + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold">{panel.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{panel.visual}</p>
                                <p className="text-xs text-primary mt-2">Symbolism: {panel.symbolism}</p>
                                <p className="text-xs text-secondary">Emotion: {panel.emotion}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="prompts" className="space-y-4">
                  {content.imagePrompts?.map((prompt, i) => (
                    <div key={i} className="relative">
                      <pre className="whitespace-pre-wrap text-sm bg-muted/30 rounded-lg p-4 font-mono text-xs">
                        {prompt}
                      </pre>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(prompt, `prompt-${i}`)}
                      >
                        {copiedField === `prompt-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="posts" className="space-y-6">
                  {content.posts && (
                    <>
                      {["short", "medium", "long"].map((length) => (
                        <div key={length} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold capitalize">{length} Version</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(content.posts![length as keyof typeof content.posts], `post-${length}`)}
                            >
                              {copiedField === `post-${length}` ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                              Copy
                            </Button>
                          </div>
                          <pre className="whitespace-pre-wrap text-sm bg-muted/30 rounded-lg p-4 font-sans">
                            {content.posts[length as keyof typeof content.posts]}
                          </pre>
                        </div>
                      ))}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="voice">
                  <div className="text-center py-8 text-muted-foreground">
                    <Mic className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Generate a narrative first, then create a voiceover script</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
