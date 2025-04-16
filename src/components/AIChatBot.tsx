'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Modal state
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 480, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dragging logic
  const startDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const onDrag = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const stopDrag = () => setIsDragging(false);

  // Resizing logic
  const startResize = () => setIsResizing(true);

  const onResize = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = e.clientX - position.x;
    const newHeight = e.clientY - position.y;
    setSize({
      width: Math.max(320, newWidth),
      height: Math.max(300, newHeight)
    });
  };

  const stopResize = () => setIsResizing(false);

  useEffect(() => {
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', onResize);
    window.addEventListener('mouseup', stopResize);

    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('mousemove', onResize);
      window.removeEventListener('mouseup', stopResize);
    };
  });

  // Click outside to close
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botContent = '';

      const botMessage = { role: 'assistant' as const, content: '' };
      setMessages((prev) => [...prev, botMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        botContent += chunk;

        setMessages((prev) =>
          prev.map((msg, i) =>
            i === prev.length - 1 ? { ...msg, content: botContent } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <Button
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full p-0 shadow-lg z-50"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {open && (
        <div
          ref={modalRef}
          className="fixed z-50 bg-white border shadow-xl rounded-xl overflow-hidden flex flex-col"
          style={{
            width: size.width,
            height: size.height,
            top: position.y,
            left: position.x,
          }}
        >
          {/* Header with drag handle */}
          <div
            className="flex justify-between items-center px-4 py-2 cursor-move bg-gray-100 border-b"
            onMouseDown={startDrag}
          >
            <span className="font-semibold text-gray-800">AI Recipe Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-black transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat content */}
          <div className="flex-1 p-4 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 pr-2">
              <div className="flex flex-col space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'break-words whitespace-pre-wrap',
                      'rounded-lg px-4 py-2',
                      'max-w-[80%] w-fit',
                      message.role === 'user'
                        ? 'ml-auto bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ))}

                {isLoading && (
                  <div className="bg-muted break-words whitespace-pre-wrap max-w-[80%] w-fit rounded-lg px-4 py-2">
                    Thinking...
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <div className="flex items-center space-x-2 pt-4">
              <Input
                placeholder="Ask about recipes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                disabled={isLoading}
              />
              <Button onClick={handleSend} size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Resizer corner */}
          <div
            onMouseDown={startResize}
            className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize bg-transparent"
          />
        </div>
      )}
    </>
  );
}
