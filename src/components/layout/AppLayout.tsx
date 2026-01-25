import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { ChatBubble } from "@/components/chat/ChatBubble";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8 page-transition">
          {children}
        </div>
      </main>
      <ChatBubble />
    </div>
  );
}
