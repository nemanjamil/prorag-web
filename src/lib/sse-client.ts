import type { QueryRequest, SseEvent } from '@/types/query';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export function streamQuery(
  request: QueryRequest,
  callbacks: {
    onEvent: (event: SseEvent) => void;
    onError: (error: Error) => void;
    onComplete: () => void;
  },
): AbortController {
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(`${BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        let message = response.statusText;
        try {
          const body = await response.json();
          message = Array.isArray(body.message) ? body.message.join(', ') : body.message || message;
        } catch {
          // body isn't JSON
        }
        callbacks.onError(new Error(message));
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep the last potentially incomplete line in the buffer
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const payload = trimmed.slice(6);
          if (payload === '[DONE]') {
            callbacks.onComplete();
            return;
          }

          try {
            const event = JSON.parse(payload) as SseEvent;
            callbacks.onEvent(event);
          } catch {
            // skip unparseable lines
          }
        }
      }

      callbacks.onComplete();
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    }
  })();

  return controller;
}
