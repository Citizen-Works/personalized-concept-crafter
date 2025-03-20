
/**
 * UI-related type definitions
 */
export type Attribute = 'class' | 'data-theme' | 'data-mode';

export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: Attribute | Attribute[];
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  forcedTheme?: string;
  enableColorScheme?: boolean;
}

export type TranscriptionStage = 'idle' | 'preparing' | 'uploading' | 'transcribing' | 'complete';

export interface TranscriptionProgressCallback {
  (progress: number, stage: TranscriptionStage): void;
}
