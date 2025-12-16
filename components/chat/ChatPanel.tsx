'use client';

import { useState, useRef, useEffect } from 'react';

// Toggle between local and deployed backend
// Set to true for local development, false for production

const CHAT_BACKEND_URL = "https://todoapp-backend-1cgx.onrender.com/api/v1/chat/";

interface Message {
  role: string;
  content: string;
  taskData?: any;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate?: () => void; // Callback to refresh todos after chat action
}

export function ChatPanel({ isOpen, onClose, onTaskUpdate }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);
    setError('');

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      console.log('Sending chat request to:', CHAT_BACKEND_URL);

      const response = await fetch(CHAT_BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      console.log('Chat response status:', response.status);
      const data = await response.json();
      console.log('Chat response data:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Backend error');
      }

      const assistantMessage = data.response_message || data.response || 'No response from backend';

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: assistantMessage,
          taskData: data.task_data
        }
      ]);

      // Always refresh todos after successful chat response
      // This ensures UI updates whenever the chatbot might have modified tasks
      if (onTaskUpdate) {
        console.log('Refreshing todos...');
        // Small delay to ensure backend has committed the task changes
        setTimeout(() => {
          onTaskUpdate();
        }, 300);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Connection error. Is backend running?';
      setError(errorMessage);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `Error: ${errorMessage}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'List Tasks', message: 'List all my tasks' },
    { label: 'Add Task', message: 'Add a task to ' },
    { label: 'Summary', message: 'Give me a summary of my tasks' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Chat Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[400px] bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-linear-to-r from-blue-600 to-indigo-600">
          <div>
            <h2 className="text-lg font-semibold text-white">Task Assistant</h2>
            <p className="text-xs text-blue-100">AI-powered task management</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="text-5xl mb-3">💬</div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Chat with your tasks
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Try: &quot;Add a task to buy groceries&quot;
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 justify-center">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(action.message)}
                    className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>

                {/* Task Data Display */}
                {msg.taskData?.tasks && msg.taskData.tasks.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                    <p className="text-xs font-semibold mb-1.5">Tasks ({msg.taskData.tasks.length})</p>
                    <div className="space-y-1">
                      {msg.taskData.tasks.slice(0, 5).map((task: any, i: number) => (
                        <div key={i} className="text-xs py-1 px-2 bg-white/50 dark:bg-gray-700 rounded flex items-center gap-2">
                          <span>{task.completed ? '✅' : '⭕'}</span>
                          <span className="flex-1 truncate">{task.title}</span>
                        </div>
                      ))}
                      {msg.taskData.tasks.length > 5 && (
                        <p className="text-xs text-gray-500">+{msg.taskData.tasks.length - 5} more...</p>
                      )}
                    </div>
                  </div>
                )}

                {msg.taskData?.title && !msg.taskData?.tasks && (
                  <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600 text-xs">
                    <span className="font-semibold">✅ Task:</span> {msg.taskData.title}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
