import { Metadata } from "next";
import { SideNav } from "@/components/side-nav"
import { ChatbotProvider } from "@/components/chatbot-provider"
import { ChatbotInterface } from "@/components/chatbot-interface"

export const metadata: Metadata = {
  title: "Dashboard | Fashion Assistant",
  description: "Your personalized fashion dashboard with recommendations, favorites, and chat history.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatbotProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SideNav />
        <main className="flex-1 p-6">
          {children}
        </main>
        <ChatbotInterface />
      </div>
    </ChatbotProvider>
  );
} 