// In development, Vite forwards /api to Django (see vite.config.ts).
// For a live site, set VITE_API_URL to your deployed backend, e.g. https://api.example.com
const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { detail?: string }).detail || 'Request failed');
  return data as T;
}

export const sendEnquiry = (payload: {
  name: string; email: string; phone: string; project_type: string; message: string;
}) => post<{ detail: string }>('/api/enquiries/', payload);

export const askAssistant = (messages: ChatMessage[]) =>
  post<{ reply: string }>('/api/chat/', { messages });
