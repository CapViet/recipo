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

type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 480, height: 600 });

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [resizeDir, setResizeDir] = useState<ResizeDirection | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Drag logic
  const startDrag = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.chat-scroll')) return;

    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const onDrag = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  };

  const stopDrag = () => setIsDragging(false);

  // Resize logic
  const startResize = (dir: ResizeDirection) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeDir(dir);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize(size);
    setStartCoords(position);
  };

  const onResize = (e: MouseEvent) => {
    if (!resizeDir) return;

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newX = startCoords.x;
    let newY = startCoords.y;

    if (resizeDir.includes('right')) newWidth = Math.max(320, startSize.width + dx);
    if (resizeDir.includes('left')) {
      newWidth = Math.max(320, startSize.width - dx);
      newX = startCoords.x + dx;
    }
    if (resizeDir.includes('bottom')) newHeight = Math.max(300, startSize.height + dy);
    if (resizeDir.includes('top')) {
      newHeight = Math.max(300, startSize.height - dy);
      newY = startCoords.y + dy;
    }

    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
  };

  const stopResize = () => setResizeDir(null);

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

  // Outside click
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

  const resizeHandles = [
    { dir: 'top-left', className: 'top-0 left-0 cursor-nwse-resize' },
    { dir: 'top-right', className: 'top-0 right-0 cursor-nesw-resize' },
    { dir: 'bottom-left', className: 'bottom-0 left-0 cursor-nesw-resize' },
    { dir: 'bottom-right', className: 'bottom-0 right-0 cursor-nwse-resize' },
    { dir: 'top', className: 'top-0 left-1/2 -translate-x-1/2 cursor-ns-resize' },
    { dir: 'bottom', className: 'bottom-0 left-1/2 -translate-x-1/2 cursor-ns-resize' },
    { dir: 'left', className: 'left-0 top-1/2 -translate-y-1/2 cursor-ew-resize' },
    { dir: 'right', className: 'right-0 top-1/2 -translate-y-1/2 cursor-ew-resize' },
  ];

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
          onMouseDown={startDrag}
        >
          <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
            <span className="font-semibold text-gray-800">AI Recipe Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-black transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 pr-2 chat-scroll">
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

          {resizeHandles.map((handle) => (
            <div
              key={handle.dir}
              onMouseDown={startResize(handle.dir as ResizeDirection)}
              className={`absolute w-3 h-3 bg-transparent z-50 ${handle.className}`}
              style={{ zIndex: 60 }}
            />
          ))}
        </div>
      )}
    </>
  );
}
