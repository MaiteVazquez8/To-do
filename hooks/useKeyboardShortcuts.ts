import { useEffect, useRef } from 'react';

type Handlers = {
  onNewTask: () => void;
  onFocusSearch: () => void;
  onEscape: () => void;
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return target.isContentEditable;
}

/**
 * Desktop shortcuts (web only): `N` creates a task, `/` focuses search and
 * `Esc` closes any open modal. Never fires while the user is typing inside an
 * input or when a modifier key is held, so browser/native shortcuts survive.
 */
export function useKeyboardShortcuts(handlers: Handlers): void {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (typeof window === 'undefined') return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      const key = event.key.toLowerCase();
      if (key === 'n' && !event.repeat) {
        event.preventDefault();
        handlersRef.current.onNewTask();
      } else if (key === '/') {
        event.preventDefault();
        handlersRef.current.onFocusSearch();
      } else if (key === 'escape') {
        handlersRef.current.onEscape();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}