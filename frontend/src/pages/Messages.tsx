
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import ChatList from "@/components/Messages/ChatList";
import ChatView from "@/components/Messages/ChatView";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Mock chat data
const MOCK_CHATS = [
  {
    id: "chat1",
    name: "Sarah Johnson",
    lastMessage: "I'll send you the video later today!",
    timestamp: "2m ago",
    unread: 2
  },
  {
    id: "chat2",
    name: "Alex Martinez",
    lastMessage: "That was amazing! 🔥",
    timestamp: "1h ago",
    unread: 0
  },
  {
    id: "chat3",
    name: "Taylor Swift",
    lastMessage: "Let's collaborate on the next video",
    timestamp: "3h ago",
    unread: 1
  },
  {
    id: "chat4",
    name: "Jordan Lee",
    lastMessage: "How did you add that effect?",
    timestamp: "Yesterday",
    unread: 0
  }
];

// Mock messages for the first chat
const MOCK_MESSAGES = {
  chat1: [
    {
      id: "msg1",
      text: "Hey, did you see my new video?",
      timestamp: "10:32 AM",
      isOutgoing: false
    },
    {
      id: "msg2",
      text: "Yes! It was amazing. How did you create that transition effect?",
      timestamp: "10:34 AM",
      isOutgoing: true,
      status: "read"
    },
    {
      id: "msg3",
      text: "I used the new filter in the app. I can show you how it works!",
      timestamp: "10:36 AM",
      isOutgoing: false
    },
    {
      id: "msg4",
      text: "That would be great! Can you send me a tutorial?",
      timestamp: "10:37 AM",
      isOutgoing: true,
      status: "read"
    },
    {
      id: "msg5",
      text: "I'll send you the video later today!",
      timestamp: "10:38 AM",
      isOutgoing: false,
      ephemeralTimeout: 30
    }
  ],
  chat2: [
    {
      id: "msg1",
      text: "Just watched your latest upload",
      timestamp: "9:15 AM",
      isOutgoing: false
    },
    {
      id: "msg2",
      text: "What did you think?",
      timestamp: "9:16 AM",
      isOutgoing: true,
      status: "read"
    },
    {
      id: "msg3",
      text: "That was amazing! 🔥",
      timestamp: "9:18 AM",
      isOutgoing: false
    }
  ]
};

const Messages = () => {
  const [chats, setChats] = useState(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, any>>(MOCK_MESSAGES);
  const [isMobileView, setIsMobileView] = useState(false);
  
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // On mobile, start with chat list view
    setIsMobileView(!!isMobile);
  }, [isMobile]);
  
  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    
    // Clear unread count for selected chat
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    ));
    
    // On mobile, show the chat view
    if (isMobile) {
      setIsMobileView(false);
    }
  };
  
  const handleSendMessage = (chatId: string, message: string) => {
    const now = new Date();
    const formattedTime = format(now, "h:mm a");
    
    const newMessage = {
      id: `msg${Date.now()}`,
      text: message,
      timestamp: formattedTime,
      isOutgoing: true,
      status: "sent"
    };
    
    // Add new message to the chat
    setChatMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));
    
    // Update chat preview
    setChats(chats.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            lastMessage: message,
            timestamp: "Just now"
          } 
        : chat
    ));
    
    // Simulate message delivery after a short delay
    setTimeout(() => {
      setChatMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].map((msg: any) => 
          msg.id === newMessage.id 
            ? { ...msg, status: "delivered" } 
            : msg
        )
      }));
      
      // Simulate message read after another delay
      setTimeout(() => {
        setChatMessages(prev => ({
          ...prev,
          [chatId]: prev[chatId].map((msg: any) => 
            msg.id === newMessage.id 
              ? { ...msg, status: "read" } 
              : msg
          )
        }));
        
        // Simulate a reply after read
        const replies = [
          "That's interesting!",
          "Thanks for letting me know 👍",
          "Sounds good!",
          "I'll check it out",
          "Great idea! 🔥"
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        setTimeout(() => {
          const replyMessage = {
            id: `msg${Date.now()}`,
            text: randomReply,
            timestamp: format(new Date(), "h:mm a"),
            isOutgoing: false
          };
          
          setChatMessages(prev => ({
            ...prev,
            [chatId]: [...prev[chatId], replyMessage]
          }));
          
          // Update chat preview with the reply
          setChats(chats.map(chat => 
            chat.id === chatId 
              ? { 
                  ...chat, 
                  lastMessage: randomReply,
                  timestamp: "Just now",
                  unread: activeChatId === chatId ? 0 : 1
                } 
              : chat
          ));
        }, 2000);
      }, 1000);
    }, 1000);
  };
  
  const activeChat = activeChatId && {
    id: activeChatId,
    name: chats.find(c => c.id === activeChatId)?.name || "",
    messages: chatMessages[activeChatId] || [],
    isEphemeral: activeChatId === "chat1", // Demo: first chat has ephemeral messages
    ephemeralDuration: 30
  };
  
  return (
    <AppLayout className="pb-16">
      <div className="h-[calc(100vh-120px)] flex">
        <div 
          className={cn(
            "w-full md:w-1/3 md:border-r",
            !isMobile || isMobileView ? "block" : "hidden"
          )}
        >
          <ChatList 
            chats={chats} 
            activeChat={activeChatId || undefined} 
            onChatSelect={handleChatSelect} 
          />
        </div>
        
        <div 
          className={cn(
            "w-full md:w-2/3",
            !isMobile || !isMobileView ? "block" : "hidden"
          )}
        >
          {activeChat ? (
            <ChatView 
              chat={activeChat} 
              onBack={() => setIsMobileView(true)}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-center">
              <div className="max-w-md">
                <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a chat from the list to start messaging or create a new conversation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Messages;
