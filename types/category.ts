export interface Category {
  id: string;
  name: string;
  /** Hex color used for the category badge, e.g. `#4F6BED`. */
  color: string;
  createdAt: string;
}

export type CategoryUpdates = Partial<Pick<Category, 'name' | 'color'>>;