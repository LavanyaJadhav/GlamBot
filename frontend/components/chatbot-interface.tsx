"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChatbot } from "@/components/chatbot-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GoogleGenerativeAI } from "@google/generative-ai"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

const quickResponses = [
  "What's trending this season?",
  "How do I style a blazer?",
  "Recommend colors for my skin tone",
  "Help me build a capsule wardrobe",
]

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyDdmZ7fLhdUNy4fO7bgxB_Qvrd7dXXm5C8")
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  }
})

export function ChatbotInterface() {
  const { isOpen, toggleChat } = useChatbot()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm your fashion assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = async () => {
    if (input.trim() === "") return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      // Create fashion-focused prompt with more structure
      const prompt = `You are Glambot, an expert fashion AI assistant. Please help with this fashion query: "${input}"

      Consider:
      1. Latest Fashion Trends (2024-2025)
      2. Personal Style Development
      3. Practical Styling Tips
      4. Color Coordination
      5. Occasion-Appropriate Recommendations

      Please provide specific, actionable advice that's both trendy and wearable.`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const aiResponse = response.text()
      console.log('AI Response:', aiResponse)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble accessing my fashion knowledge. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickResponse = (response: string) => {
    setInput(response)
    handleSend()
  }

  return (
    <>
      {/* Chat bubble */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      {/* Chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-background border rounded-lg shadow-xl flex flex-col overflow-hidden"
          >
            {/* Chat header */}
            <div className="p-4 border-b bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Glambot" />
                  <AvatarFallback className="bg-accent text-accent-foreground">GB</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-playfair font-bold">Glambot Assistant</h3>
                  <p className="text-xs text-primary-foreground/80">Fashion AI at your service</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/30 text-foreground border"
                    }`}
                  >
                    {message.sender === "bot" && (
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Glambot" />
                          <AvatarFallback className="text-xs bg-accent text-accent-foreground">GB</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold">Glambot</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary/30 text-foreground border rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Glambot" />
                        <AvatarFallback className="text-xs bg-accent text-accent-foreground">GB</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold">Glambot</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse delay-150"></div>
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick responses */}
            <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto">
              {quickResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap text-xs"
                  onClick={() => handleQuickResponse(response)}
                >
                  {response}
                </Button>
              ))}
            </div>

            {/* Chat input */}
            <div className="p-4 border-t flex gap-2">
              <Button variant="outline" size="icon" className="shrink-0">
                <Image className="h-5 w-5" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend()
                  }
                }}
              />
              <Button onClick={handleSend} className="shrink-0 bg-primary hover:bg-primary/90">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

