
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Paperclip, Mic, Clock, Check, CheckCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
  status?: "sent" | "delivered" | "read";
  ephemeralTimeout?: number; // in seconds
}

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  messages: Message[];
  isEphemeral?: boolean;
  ephemeralDuration?: number; // in seconds
}

interface ChatViewProps {
  chat: Chat;
  onBack: () => void;
  onSendMessage: (chatId: string, message: string) => void;
}

const ChatView = ({ chat, onBack, onSendMessage }: ChatViewProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: number }>({});
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);
  
  // Handle ephemeral messages countdown
  useEffect(() => {
    if (!chat.isEphemeral) return;
    
    const timers: { [key: string]: number } = {};
    const intervals: NodeJS.Timeout[] = [];
    
    chat.messages.forEach((msg) => {
      if (msg.ephemeralTimeout) {
        timers[msg.id] = msg.ephemeralTimeout;
        
        const interval = setInterval(() => {
          setTimeRemaining((prev) => {
            const newTimeRemaining = { ...prev };
            
            if (newTimeRemaining[msg.id] > 0) {
              newTimeRemaining[msg.id] -= 1;
            } else {
              clearInterval(interval);
            }
            
            return newTimeRemaining;
          });
        }, 1000);
        
        intervals.push(interval);
      }
    });
    
    setTimeRemaining(timers);
    
    return () => {
      intervals.forEach(clearInterval);
    };
  }, [chat.isEphemeral, chat.messages]);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(chat.id, message);
      setMessage("");
    }
  };
  
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-3">
          {chat.avatar ? (
            <img 
              src={chat.avatar} 
              alt={chat.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-lg font-medium text-muted-foreground">
                {chat.name.charAt(0)}
              </span>
            </div>
          )}
          
          <div>
            <h3 className="font-medium">{chat.name}</h3>
            
            {chat.isEphemeral && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Ephemeral messages ({chat.ephemeralDuration}s)</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {chat.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "flex",
                msg.isOutgoing ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2 rounded-xl",
                  msg.isOutgoing
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-secondary text-secondary-foreground rounded-tl-none"
                )}
              >
                <p>{msg.text}</p>
                
                <div className="flex justify-end items-center mt-1 space-x-1">
                  {msg.ephemeralTimeout && timeRemaining[msg.id] !== undefined && (
                    <span className="text-xs opacity-70 flex items-center">
                      <Clock className="h-3 w-3 mr-0.5" />
                      {timeRemaining[msg.id]}s
                    </span>
                  )}
                  
                  <span className="text-xs opacity-70">{msg.timestamp}</span>
                  
                  {msg.isOutgoing && getStatusIcon(msg.status)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="bg-secondary border-none"
          />
          
          <Button 
            size="icon" 
            disabled={!message.trim()}
            onClick={handleSendMessage}
            className={cn(
              "rounded-full", 
              !message.trim() ? "bg-secondary" : ""
            )}
          >
            {message.trim() ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
