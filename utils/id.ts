/**
 * Generates a reasonably unique identifier for locally created tasks.
 * Good enough for a single-device persistence layer; swap for
 * crypto.randomUUID() if multi-device sync is added later.
 */
export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}