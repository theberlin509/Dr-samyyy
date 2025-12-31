
export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO string for storage
  attachments?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdate: string;
}
