import { Injectable } from '@angular/core';
import { LanguageService } from './language.service';

export interface TranslationSet {
  en: string;
  my: string;
}

export interface Translations {
  [key: string]: TranslationSet;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations: Translations = {
    settings: {
      en: 'Settings',
      my: 'ဆက်တင်များ',
    },
    'settings.appearance': {
      en: 'Appearance',
      my: 'အပြင်အဆင်',
    },
    'settings.theme': {
      en: 'Theme',
      my: 'အပြင်အဆင်',
    },
    light: {
      en: 'Light',
      my: 'အလင်း',
    },
    dark: {
      en: 'Dark',
      my: 'အမှောင်',
    },
    language: {
      en: 'Language',
      my: 'ဘာသာစကား',
    },
    'converter.title': {
      en: 'Zawgyi to Unicode Converter',
      my: 'ဇော်ဂျီ - ယူနီကုဒ် ပြောင်းစနစ်',
    },
    'converter.subtitle': {
      en: 'Convert between Zawgyi and Unicode with ease',
      my: 'ဇော်ဂျီနှင့် ယူနီကုဒ်ကို အလွယ်တကူ ပြောင်းလဲနိုင်ပါသည်',
    },
    'converter.mode.auto': {
      en: 'Auto',
      my: 'အော်တို',
    },
    'converter.mode.zawgyi': {
      en: 'Zawgyi',
      my: 'ဇော်ဂျီ',
    },
    'converter.mode.unicode': {
      en: 'Unicode',
      my: 'ယူနီ',
    },
    'converter.input.placeholder': {
      en: 'Enter text here...',
      my: 'စာသားထည့်ပါ...',
    },
    'converter.output.placeholder': {
      en: 'Converted text will appear here...',
      my: 'ပြောင်းလဲပြီးစာသား ဤနေရာတွင်ပြမည်...',
    },
    'converter.copy': {
      en: 'Copy',
      my: 'ကူးယူရန်',
    },
    'converter.paste': {
      en: 'Paste',
      my: 'ကူးထည့်ရန်',
    },
    'converter.clear': {
      en: 'Clear',
      my: 'ရှင်းရန်',
    },
  };

  constructor(private languageService: LanguageService) {}

  translate(key: keyof Translations): string {
    const currentLang = this.languageService.getCurrentLanguage();
    const translation = this.translations[key];

    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return String(key);
    }

    return translation[currentLang] || String(key);
  }
}
