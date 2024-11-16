import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme = new BehaviorSubject<Theme>(this.getInitialTheme());
  theme$ = this.theme.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme as Theme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  getCurrentTheme(): Theme {
    return this.theme.getValue();
  }

  setTheme(newTheme: Theme) {
    this.theme.next(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  initializeTheme() {
    const currentTheme = this.getInitialTheme();
    this.setTheme(currentTheme);
  }
}
