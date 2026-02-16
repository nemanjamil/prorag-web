import { useState, useCallback, useRef, useEffect } from 'react';
import { streamQuery } from '@/lib/sse-client';
import type { QueryRequest, PipelineMetadata } from '@/types/query';

type PipelineStatus = 'idle' | 'streaming' | 'done' | 'error';

export function useQueryPipeline() {
  const [status, setStatus] = useState<PipelineStatus>('idle');
  const [answer, setAnswer] = useState('');
  const [metadata, setMetadata] = useState<PipelineMetadata | null>(null);
  const [queryLogId, setQueryLogId] = useState<number | null>(null);
  const [finalCostUsd, setFinalCostUsd] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStatus('idle');
    setAnswer('');
    setMetadata(null);
    setQueryLogId(null);
    setFinalCostUsd(null);
    setError(null);
  }, []);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStatus('idle');
  }, []);

  const execute = useCallback((request: QueryRequest) => {
    // Reset previous state
    controllerRef.current?.abort();
    setStatus('streaming');
    setAnswer('');
    setMetadata(null);
    setQueryLogId(null);
    setFinalCostUsd(null);
    setError(null);

    const controller = streamQuery(request, {
      onEvent: (event) => {
        switch (event.type) {
          case 'metadata':
            setMetadata(event.data);
            break;
          case 'token':
            setAnswer((prev) => prev + event.data.token);
            break;
          case 'done':
            setQueryLogId(event.data.queryLogId);
            setFinalCostUsd(event.data.finalCostUsd);
            setStatus('done');
            break;
          case 'error':
            setError(event.data.message);
            setStatus('error');
            break;
        }
      },
      onError: (err) => {
        setError(err.message);
        setStatus('error');
      },
      onComplete: () => {
        // status is set by 'done' event; this handles connection close
      },
    });

    controllerRef.current = controller;
  }, []);

  // Abort on unmount
  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return {
    status,
    answer,
    metadata,
    queryLogId,
    finalCostUsd,
    error,
    execute,
    cancel,
    reset,
  };
}
