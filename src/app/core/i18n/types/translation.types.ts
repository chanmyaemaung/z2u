export type Language = 'en' | 'my';

export type TranslationKey =
  | 'title'
  | 'description'
  | 'settings.title'
  | 'settings.appearance'
  | 'settings.language'
  | 'settings.theme'
  | 'light'
  | 'dark'
  | 'language'
  | 'converter.title'
  | 'converter.subtitle'
  | 'converter.input'
  | 'converter.output'
  | 'converter.input.placeholder'
  | 'converter.output.placeholder'
  | 'converter.paste'
  | 'converter.clear'
  | 'converter.mode.auto'
  | 'converter.mode.zawgyi'
  | 'converter.mode.unicode'
  | 'toast.clipboard.error'
  | 'toast.copy.success'
  | 'toast.copy.error';

export type TranslationSet = Record<TranslationKey, string>;

export type Translations = Record<Language, TranslationSet>;
