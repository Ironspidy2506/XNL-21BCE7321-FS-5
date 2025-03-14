
import React from "react";
import { Search, PlusCircle, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChatPreview {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface ChatListProps {
  chats: ChatPreview[];
  activeChat?: string;
  onChatSelect: (chatId: string) => void;
}

const ChatList = ({ chats, activeChat, onChatSelect }: ChatListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button variant="ghost" size="icon" className="rounded-full">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search conversations" 
            className="pl-9 bg-secondary border-none"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <MoreVertical className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No messages yet</h3>
            <p className="text-sm text-muted-foreground">
              Start a conversation with someone to chat.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {chats.map((chat) => (
              <motion.li
                key={chat.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChatSelect(chat.id)}
                className={cn(
                  "p-4 hover:bg-secondary/50 cursor-pointer transition-colors duration-200",
                  activeChat === chat.id && "bg-secondary"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {chat.avatar ? (
                      <img 
                        src={chat.avatar} 
                        alt={chat.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-lg font-medium text-muted-foreground">
                          {chat.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {chat.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs bg-primary text-primary-foreground">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-medium truncate">{chat.name}</h4>
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                    </div>
                    <p className={cn(
                      "text-sm truncate",
                      chat.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatList;
