import { Injectable } from '@angular/core';
import { enTranslations } from '@core/i18n/translations/en';
import { myTranslations } from '@core/i18n/translations/my';
import { TranslationKey } from '@core/i18n/types/translation.types';
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
  private translations = {
    en: enTranslations,
    my: myTranslations,
  };

  constructor(private languageService: LanguageService) {}

  translate(key: TranslationKey): string {
    const currentLang = this.languageService.getCurrentLanguage();
    const translation = this.translations[currentLang][key];

    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    return translation;
  }
}
