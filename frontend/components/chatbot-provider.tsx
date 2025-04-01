"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { ChatbotInterface } from "@/components/chatbot-interface"

type ChatbotContextType = {
  isOpen: boolean
  toggleChat: () => void
  openChat: () => void
  closeChat: () => void
}

// Create a default context value to avoid the "must be used within a provider" error
const defaultContextValue: ChatbotContextType = {
  isOpen: false,
  toggleChat: () => {},
  openChat: () => {},
  closeChat: () => {},
}

const ChatbotContext = createContext<ChatbotContextType>(defaultContextValue)

export function useChatbot() {
  const context = useContext(ChatbotContext)
  return context
}

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleChat = () => setIsOpen((prev) => !prev)
  const openChat = () => setIsOpen(true)
  const closeChat = () => setIsOpen(false)

  const value = {
    isOpen,
    toggleChat,
    openChat,
    closeChat,
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
      {mounted && <ChatbotInterface />}
    </ChatbotContext.Provider>
  )
}

