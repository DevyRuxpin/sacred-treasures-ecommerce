"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Phone, Mail, Clock } from "lucide-react"

interface ChatMessage {
  id: string
  content: string
  isFromUser: boolean
  timestamp: Date
  type?: "text" | "system"
}

interface LiveChatProps {
  isOpen: boolean
  onClose: () => void
}

export function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      // Initialize with welcome message
      setMessages([
        {
          id: "welcome",
          content: "Welcome to Sacred Treasures! How can we help you today?",
          isFromUser: false,
          timestamp: new Date(),
          type: "system"
        }
      ])
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isFromUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputMessage),
        isFromUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes("order") || message.includes("shipping")) {
      return "I can help you with order and shipping questions. You can track your order in your account dashboard, or I can connect you with our shipping team for specific inquiries."
    }
    
    if (message.includes("product") || message.includes("item")) {
      return "For product questions, I can provide information about our religious items, materials, and care instructions. Is there a specific product you'd like to know more about?"
    }
    
    if (message.includes("return") || message.includes("refund")) {
      return "Our return policy allows returns within 30 days of purchase. Items must be in original condition. Would you like me to help you start a return request?"
    }
    
    if (message.includes("payment") || message.includes("billing")) {
      return "I can help with payment and billing questions. We accept all major credit cards and PayPal. For billing issues, I can connect you with our billing department."
    }
    
    if (message.includes("help") || message.includes("support")) {
      return "I'm here to help! You can ask me about orders, products, returns, payments, or any other questions about Sacred Treasures. What would you like to know?"
    }
    
    // Default responses
    const defaultResponses = [
      "Thank you for your message. Let me connect you with a support specialist who can better assist you with that.",
      "I understand your concern. One of our support team members will be with you shortly to provide personalized assistance.",
      "That's a great question! I'll make sure our support team addresses this for you right away.",
      "I appreciate you reaching out. Our support team is here to help and will respond to your inquiry shortly."
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { label: "Track Order", action: "I need help tracking my order" },
    { label: "Product Info", action: "I have questions about a product" },
    { label: "Returns", action: "I need help with a return" },
    { label: "Billing", action: "I have a billing question" }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] z-50">
      <Card className="h-full flex flex-col shadow-2xl border-2">
        <CardHeader className="pb-3 bg-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <CardTitle className="text-lg">Live Chat</CardTitle>
              <Badge 
                variant={isOnline ? "secondary" : "destructive"}
                className="text-xs"
              >
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isFromUser
                      ? "bg-primary text-primary-foreground"
                      : message.type === "system"
                      ? "bg-muted text-muted-foreground text-center"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setInputMessage(action.action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={!isOnline}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isOnline}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Mon-Fri 9AM-6PM</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>support@sacredtreasures.com</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Chat Toggle Button
interface ChatToggleProps {
  onClick: () => void
  isOpen: boolean
  unreadCount?: number
}

export function ChatToggle({ onClick, isOpen, unreadCount = 0 }: ChatToggleProps) {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button
        onClick={onClick}
        size="lg"
        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}
