export interface Rule {
  from: string;
  to: string;
}

export type FontType = 'zawgyi' | 'unicode' | null;
export type Mode = 'auto' | Exclude<FontType, null>;
export type DetectedFont = FontType;
