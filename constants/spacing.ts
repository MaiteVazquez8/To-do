export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/**
 * Layout tokens: the app content is constrained to a comfortable column so it
 * stays usable on tablets and desktop instead of stretching edge to edge.
 */
export const layout = {
  contentMaxWidth: 640,
} as const;

export const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 } as const;