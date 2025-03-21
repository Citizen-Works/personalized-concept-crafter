
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, SendIcon, UserIcon, Bot, Info } from 'lucide-react';
import { ChatMessage } from '@/services/onboardingAssistantService';
import { OnboardingModule } from '@/hooks/onboarding/useOnboardingModules';

interface OnboardingChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onFinishChat: () => void;
  currentModule?: OnboardingModule;
}

const OnboardingChat: React.FC<OnboardingChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onFinishChat,
  currentModule
}) => {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput('');
    await onSendMessage(message);
    
    // Focus back on textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Quick responses for multiple choice options
  const handleQuickResponse = async (response: string) => {
    if (isLoading) return;
    
    setInput('');
    await onSendMessage(response);
  };
  
  // Handle textarea height adjustment
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };
  
  // Handle textarea keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Extract quick reply options from the last assistant message if available
  const getQuickReplyOptions = (): string[] => {
    if (messages.length === 0) return [];
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'assistant') return [];
    
    // Look for options formatted as numbered or bulleted lists
    const optionsMatch = lastMessage.content.match(/(?:^\d+\.\s*(.+)$|^\*\s*(.+)$|^-\s*(.+)$)/gm);
    if (!optionsMatch) return [];
    
    return optionsMatch.map(option => 
      option.replace(/^(?:\d+\.\s*|\*\s*|-\s*)/, '').trim()
    ).filter(option => 
      option.length > 0 && option.length < 50
    ).slice(0, 4); // Limit to 4 options for UI clarity
  };

  const quickReplyOptions = getQuickReplyOptions();
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          Content Strategy Assistant
          {currentModule && (
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              • {currentModule.title}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div 
              key={i}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === 'assistant'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === 'assistant' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                  <div className="text-xs font-medium">
                    {message.role === 'assistant' ? 'Consultant' : 'You'}
                  </div>
                </div>
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <div className="text-xs font-medium">Consultant</div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Thinking...
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {currentModule && (
        <div className="px-4 py-2 border-t border-b bg-muted/50">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">{currentModule.title}</p>
              <p>{currentModule.hint}</p>
            </div>
          </div>
        </div>
      )}
      
      <CardFooter className="p-4 border-t">
        {/* Quick reply options */}
        {quickReplyOptions.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2 w-full">
            {quickReplyOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickResponse(option)}
                disabled={isLoading}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-2">
          <div className="flex">
            <Textarea
              ref={textareaRef}
              placeholder="Type your message..."
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 min-h-[40px] max-h-[200px] resize-none"
              rows={1}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()} 
              className="ml-2 self-end h-10"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button 
              type="button" 
              onClick={onFinishChat}
              variant="outline"
            >
              Finish conversation
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};

export default OnboardingChat;
