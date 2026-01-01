// /**
//  * TypeScript types for the chat feature.
//  */

// export interface Message {
//   id?: string;
//   role: 'user' | 'assistant';
//   content: string;
//   skill_used?: string;
//   tool_calls?: ToolCall[];
//   created_at: string;
// }

// export interface ToolCall {
//   name: string;
//   arguments: Record<string, unknown>;
//   result?: Record<string, unknown>;
// }

// export interface ChatRequest {
//   conversation_id?: string | null;
//   message: string;
// }

// export interface ChatResponse {
//   conversation_id: string;
//   response: string;
//   tool_calls: ToolCall[];
//   skill_used: string;
//   created_at: string;
// }

// export interface Conversation {
//   id: string;
//   title: string | null;
//   created_at: string;
//   updated_at: string;
// }

// export interface ConversationsResponse {
//   conversations: Conversation[];
//   count: number;
// }

// export interface HistoryResponse {
//   conversation_id: string;
//   messages: Message[];
//   count: number;
// }

// // export type SkillType =
// //   | 'task_management'
// //   | 'task_search'
// //   | 'task_analytics'
// //   | 'task_recommendation';

// // export const SKILL_LABELS: Record<SkillType, string> = {
// //   task_management: 'Task Management',
// //   task_search: 'Search',
// //   task_analytics: 'Analytics',
// //   task_recommendation: 'Recommendations',
// // };

// // export const SKILL_COLORS: Record<SkillType, string> = {
// //   task_management: 'bg-blue-100 text-blue-800',
// //   task_search: 'bg-purple-100 text-purple-800',
// //   task_analytics: 'bg-green-100 text-green-800',
// //   task_recommendation: 'bg-orange-100 text-orange-800',
// // };
// /**
//  * Chat-related TypeScript types
//////////////////// */

// Message in conversation history
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Full message type with all fields (used by MessageList)
export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  skill_used?: string;
  created_at: string;
  taskData?: any;
}

// Request to send a chat message
export interface ChatRequest {
  message: string;
  conversation_history?: ChatMessage[];
}

// Response from chat endpoint
export interface ChatResponse {
  response: string;
  response_message: string;
  action_taken?: string | null;
  task_data?: {
    id?: string;
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: string;
    tags?: string[];
    due_date?: string;
    tasks?: any[];
    [key: string]: any;
  } | null;
}

// Legacy types for conversations (if you still need them)
export interface ConversationsResponse {
  conversations: Array<{
    id: string;
    title?: string;
    created_at: string;
    updated_at: string;
  }>;
  total: number;
}

export interface HistoryResponse {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  conversation_id: string;
}





export type SkillType =
  | 'task_management'
  | 'task_search'
  | 'task_analytics'
  | 'task_recommendation';

export const SKILL_LABELS: Record<SkillType, string> = {
  task_management: 'Task Management',
  task_search: 'Search',
  task_analytics: 'Analytics',
  task_recommendation: 'Recommendations',
};

export const SKILL_COLORS: Record<SkillType, string> = {
  task_management: 'bg-blue-100 text-blue-800',
  task_search: 'bg-purple-100 text-purple-800',
  task_analytics: 'bg-green-100 text-green-800',
  task_recommendation: 'bg-orange-100 text-orange-800',
};
