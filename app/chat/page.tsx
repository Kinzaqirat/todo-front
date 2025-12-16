// 'use client'
// import { useState, useRef, useEffect } from 'react';

// interface Message {
//   role: string;
//   content: string;
//   taskData?: any;
// }

// export default function SimpleChat() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = input;
//     setInput('');
//     setIsLoading(true);
//     setError('');

//     const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
//     setMessages(newMessages);

//     try {
//       console.log('Sending request to backend...');
      
//       const response = await fetch('http://127.0.0.1:8000/api/v1/chat/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           message: userMessage,
//           conversation_history: messages.map(m => ({ role: m.role, content: m.content })),
//         }),
//       });

//       console.log('Response status:', response.status);
      
//       const data = await response.json();
//       console.log('Response data:', data);

//       if (!response.ok) {
//         throw new Error(data.detail || 'Backend error');
//       }

//       // Check if response_message exists
//       const assistantMessage = data.response_message || data.response || 'No response from backend';

//       setMessages([
//         ...newMessages,
//         { 
//           role: 'assistant', 
//           content: assistantMessage, 
//           taskData: data.task_data 
//         }
//       ]);
//     } catch (error: any) {
//       console.error('Error:', error);
//       const errorMessage = error.message || 'Connection error. Is backend running?';
//       setError(errorMessage);
//       setMessages([
//         ...newMessages,
//         { 
//           role: 'assistant', 
//           content: `❌ Error: ${errorMessage}` 
//         }
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="w-full max-w-5xl mx-auto flex flex-col h-full p-4">
        
//         {/* Header */}
//         <div className="mb-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//             Task Chat Assistant
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">Manage your tasks with AI</p>
//           {error && (
//             <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
//               ⚠️ {error}
//             </div>
//           )}
//         </div>

//         {/* Messages Container */}
//         <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
//           {messages.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-full text-center">
//               <div className="text-6xl mb-4">💬</div>
//               <h2 className="text-2xl font-bold text-gray-700 mb-2">Start a Conversation</h2>
//               <p className="text-gray-500 mb-4">Try: &quot;Add a task to buy groceries&quot;</p>
//               <div className="text-xs text-gray-400 mt-4">
//                 Backend URL: http://127.0.0.1:8000/api/v1/chat/
//               </div>
//             </div>
//           )}

//           <div className="space-y-4">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-md ${
//                     msg.role === 'user'
//                       ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
//                       : 'bg-gray-50 text-gray-800 border border-gray-200'
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  
//                   {msg.taskData?.tasks && msg.taskData.tasks.length > 0 && (
//                     <div className="mt-3 pt-3 border-t border-gray-300">
//                       <p className="text-sm font-semibold mb-2 flex items-center gap-2">
//                         <span>📋</span>
//                         <span>Tasks ({msg.taskData.tasks.length})</span>
//                       </p>
//                       <div className="space-y-2">
//                         {msg.taskData.tasks.map((task: any, i: number) => (
//                           <div key={i} className="text-sm py-2 px-3 bg-white rounded-lg flex items-center gap-3">
//                             <span className="text-lg">{task.completed ? '✅' : '⭕'}</span>
//                             <span className="flex-1">{task.title}</span>
//                             {task.priority && (
//                               <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
//                                 {task.priority}
//                               </span>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {msg.taskData?.title && !msg.taskData?.tasks && (
//                     <div className="mt-2 pt-2 border-t border-gray-300 text-sm">
//                       <span className="font-semibold">✅ Task Created:</span> {msg.taskData.title}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-50 border border-gray-200 px-5 py-3 rounded-2xl shadow-md">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
//                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
//                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//                     <span className="text-sm text-gray-600 ml-2">Thinking...</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>
//         </div>

//         {/* Input Area */}
//         <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
//           <div className="flex gap-3 mb-3">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && !isLoading) {
//                   sendMessage();
//                 }
//               }}
//               placeholder="Type your message..."
//               className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               disabled={isLoading}
//             />
//             <button
//               onClick={sendMessage}
//               disabled={isLoading || !input.trim()}
//               className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg"
//             >
//               {isLoading ? 'Sending...' : 'Send'}
//             </button>
//           </div>

//           {/* Quick Actions */}
//           <div className="flex gap-2">
//             <button
//               onClick={() => {
//                 setInput('List all my tasks');
//                 setTimeout(() => sendMessage(), 100);
//               }}
//               disabled={isLoading}
//               className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-all font-medium disabled:opacity-50"
//             >
//               📋 List Tasks
//             </button>
//             <button
//               onClick={() => {
//                 setInput('Add a task to buy milk');
//                 setTimeout(() => sendMessage(), 100);
//               }}
//               disabled={isLoading}
//               className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-all font-medium disabled:opacity-50"
//             >
//               ➕ Add Task
//             </button>
//             <button
//               onClick={() => {
//                 setInput('Delete task 1');
//                 setTimeout(() => sendMessage(), 100);
//               }}
//               disabled={isLoading}
//               className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-all font-medium disabled:opacity-50"
//             >
//               🗑️ Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }














'use client'
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: string;
  content: string;
  taskData?: any;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: () => void;
}

export function ChatPanel({ isOpen, onClose, onTaskUpdate }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your Task Assistant. You can:\n\n• Add tasks: "Add buy groceries"\n• List tasks: "Show all tasks"\n• Delete tasks: "Delete task 1"\n• Update tasks: "Complete task 2"\n\nHow can I help you today?'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      console.log('[Chat] Sending message:', userMessage);
      
      const response = await fetch('http://127.0.0.1:8000/api/v1/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: messages
            .filter(m => m.role !== 'assistant' || !m.content.includes('👋 Hi!'))
            .map(m => ({ role: m.role, content: m.content })),
        }),
      });

      console.log('[Chat] Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Chat] Response data:', data);

      // Extract assistant message
      const assistantMessage = data.response_message || data.response || data.message || 'No response received';

      // Add assistant response to messages
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: assistantMessage, 
          taskData: data.task_data || data.tasks
        }
      ]);

      // Trigger refresh if task was modified
      const taskModified = 
        userMessage.toLowerCase().includes('add') ||
        userMessage.toLowerCase().includes('delete') ||
        userMessage.toLowerCase().includes('remove') ||
        userMessage.toLowerCase().includes('complete') ||
        userMessage.toLowerCase().includes('update') ||
        data.task_data?.action;

      if (taskModified) {
        console.log('[Chat] Task modified, triggering refresh...');
        // Wait a bit for backend to save, then refresh
        setTimeout(() => {
          onTaskUpdate();
        }, 500);
      }

    } catch (error: any) {
      console.error('[Chat] Error:', error);
      
      const errorMessage = error.message || 'Failed to connect to chat server';
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: `❌ Error: ${errorMessage}\n\nMake sure the backend server is running at http://127.0.0.1:8000` 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">💬 Task Assistant</h2>
            <p className="text-blue-100 text-sm">Chat to manage your tasks</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-sm">
                  {msg.content}
                </p>
                
                {/* Display task data if present */}
                {msg.taskData?.tasks && msg.taskData.tasks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                    <p className="text-xs font-semibold mb-2 flex items-center gap-2 opacity-80">
                      <span>📋</span>
                      <span>Tasks ({msg.taskData.tasks.length})</span>
                    </p>
                    <div className="space-y-2">
                      {msg.taskData.tasks.slice(0, 5).map((task: any, i: number) => (
                        <div 
                          key={i} 
                          className="text-xs py-2 px-3 bg-white dark:bg-gray-700 rounded-lg flex items-center gap-2"
                        >
                          <span className="text-base">{task.completed ? '✅' : '⭕'}</span>
                          <span className="flex-1 text-gray-800 dark:text-gray-200">
                            {task.title}
                          </span>
                          {task.priority && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-medium">
                              {task.priority}
                            </span>
                          )}
                        </div>
                      ))}
                      {msg.taskData.tasks.length > 5 && (
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                          + {msg.taskData.tasks.length - 5} more tasks
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Single task created */}
                {msg.taskData?.title && !msg.taskData?.tasks && (
                  <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600 text-xs">
                    <span className="font-semibold">✅ Task Created:</span>
                    <span className="ml-1">{msg.taskData.title}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <QuickAction 
              onClick={() => setInput('List all my tasks')}
              disabled={isLoading}
              emoji="📋"
              text="List Tasks"
            />
            <QuickAction 
              onClick={() => setInput('Add a task to ')}
              disabled={isLoading}
              emoji="➕"
              text="Add Task"
            />
            <QuickAction 
              onClick={() => setInput('Delete task ')}
              disabled={isLoading}
              emoji="🗑️"
              text="Delete"
            />
            <QuickAction 
              onClick={() => setInput('Complete task ')}
              disabled={isLoading}
              emoji="✅"
              text="Complete"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ onClick, disabled, emoji, text }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 text-xs bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
    >
      <span className="mr-1">{emoji}</span>
      {text}
    </button>
  );
}

// Standalone Chat Page Component
export default function SimpleChat() {
  const [isOpen, setIsOpen] = useState(true);
  
  const handleTaskUpdate = () => {
    console.log('Task updated - refresh your main todo list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <ChatPanel 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onTaskUpdate={handleTaskUpdate}
      />
      
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition font-semibold"
        >
          Open Chat Assistant
        </button>
      )}
    </div>
  );
}