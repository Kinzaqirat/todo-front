/**
 * Chat API client for communicating with the backend.
 */

import type {
  ChatRequest,
  ChatResponse,
  ConversationsResponse,
  HistoryResponse,
} from '@/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Send a chat message and receive an AI response.
 */
export async function sendChatMessage(
  message: string,
  conversationHistory?: Array<{ role: string; content: string }>,
  token?: string
): Promise<ChatResponse> {
  const body = {
    message,
    conversation_history: conversationHistory || [],
  };

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/chat/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error ${response.status}`);
  }

  return response.json();
}

/**
 * Get all conversations for a user.
 */
export async function getConversations(
  userId: string,
  limit: number = 20,
  offset: number = 0,
  token?: string
): Promise<ConversationsResponse> {
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/${userId}/conversations?limit=${limit}&offset=${offset}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  return response.json();
}

/**
 * Get message history for a conversation.
 */
export async function getConversationHistory(
  userId: string,
  conversationId: string,
  limit: number = 50,
  token?: string
): Promise<HistoryResponse> {
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/${userId}/conversations/${conversationId}/history?limit=${limit}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  return response.json();
}
