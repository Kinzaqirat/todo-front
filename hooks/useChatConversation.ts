'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { sendChatMessage } from '@/lib/chat-api';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskData?: any;
}

export interface UseChatConversationReturn {
  messages: Message[];
  input: string;
  isLoading: boolean;
  error: string;
  sendMessage: () => Promise<void>;
  setInput: (value: string) => void;
}

/**
 * Hook for managing chat conversation state.
 * [Task]: T050
 * [Acceptance Criteria]: Manages messages, input, loading state; provides sendMessage
 */
export function useChatConversation(): UseChatConversationReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Send message to backend
  const sendMessage = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage = trimmedInput;
    setInput('');
    setIsLoading(true);
    setError('');

    // Add user message immediately
    const newMessages: Message[] = [
      ...messages,
      { role: 'user' as const, content: userMessage, timestamp: new Date() }
    ];
    setMessages(newMessages);

    try {
      // Send to backend with conversation history
      const response = await sendChatMessage(
        userMessage,
        messages.map(m => ({ role: m.role, content: m.content }))
      );

      // Add assistant response
      setMessages([
        ...newMessages,
        {
          role: 'assistant' as const,
          content: response.response_message || 'No response',
          timestamp: new Date(),
          taskData: response.task_data
        }
      ]);

      // Trigger task update notification if task was modified
      const taskModified =
        userMessage.toLowerCase().includes('add') ||
        userMessage.toLowerCase().includes('delete') ||
        userMessage.toLowerCase().includes('remove') ||
        userMessage.toLowerCase().includes('complete') ||
        userMessage.toLowerCase().includes('update') ||
        response.task_data?.action;

        
      if (taskModified) {
        window.dispatchEvent(new CustomEvent('taskUpdate', { detail: { source: 'chat' }}));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to chat server';
      setError(errorMessage);
      setMessages([
        ...newMessages,
        {
          role: 'assistant' as const,
          content: `Error: ${errorMessage}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  return {
    messages,
    input,
    isLoading,
    error,
    sendMessage,
    setInput
  };
}
