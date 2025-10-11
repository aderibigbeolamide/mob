import { useEffect } from 'react';

export interface HandoffEventDetail {
  visitId: string;
  fromStage: string;
  toStage: string;
  timestamp: number;
}

const HANDOFF_EVENT_NAME = 'patient-handoff';

export function emitHandoffEvent(
  visitId: string,
  fromStage: string,
  toStage: string
): void {
  if (typeof window === 'undefined') return;

  const detail: HandoffEventDetail = {
    visitId,
    fromStage,
    toStage,
    timestamp: Date.now(),
  };

  const event = new CustomEvent(HANDOFF_EVENT_NAME, {
    detail,
    bubbles: true,
  });

  window.dispatchEvent(event);
  
  console.log('[Queue Events] Handoff event emitted:', detail);
}

export function useHandoffListener(
  callback: (detail: HandoffEventDetail) => void
): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHandoff = (event: Event) => {
      const customEvent = event as CustomEvent<HandoffEventDetail>;
      if (customEvent.detail) {
        console.log('[Queue Events] Handoff event received:', customEvent.detail);
        callback(customEvent.detail);
      }
    };

    window.addEventListener(HANDOFF_EVENT_NAME, handleHandoff);

    return () => {
      window.removeEventListener(HANDOFF_EVENT_NAME, handleHandoff);
    };
  }, [callback]);
}
