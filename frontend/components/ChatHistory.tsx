import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  chat_id: number;
  message: string;
  response: string;
  timestamp: string;
}

interface ChatHistoryProps {
  userId: number;
}

export function ChatHistory({ userId }: ChatHistoryProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChatHistory();
  }, [userId]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/chatbot/history/${userId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading chat history...</div>;
  }

  return (
    <Card className="h-[600px]">
      <CardContent className="p-4">
        <ScrollArea className="h-[550px]">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.chat_id} className="space-y-2">
                <div className="flex justify-end">
                  <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">{msg.response}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No chat history yet. Start a conversation!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 