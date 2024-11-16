import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en' | 'my';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private language = new BehaviorSubject<Language>(this.getInitialLanguage());

  getLanguage(): Observable<Language> {
    return this.language.asObservable();
  }

  getCurrentLanguage(): Language {
    return this.language.value;
  }

  setLanguage(lang: Language) {
    this.language.next(lang);
    localStorage.setItem('language', lang);
    // Only update the data-lang attribute, don't change any fonts
    document.documentElement.setAttribute('data-lang', lang);
  }

  private getInitialLanguage(): Language {
    const savedLang = localStorage.getItem('language');
    if (savedLang) return savedLang as Language;

    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('my') ? 'my' : 'en';
  }
}
