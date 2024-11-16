import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { Language, LanguageService } from '../../services/language.service';
import { Theme, ThemeService } from '../../services/theme.service';
import {
  TranslationService,
  Translations,
} from '../../services/translation.service';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css'],
})
export class SettingsModalComponent {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private translationService = inject(TranslationService);

  theme = signal<Theme>('light');
  language = signal<Language>(this.languageService.getCurrentLanguage());
  isOpen = signal(false);

  constructor() {
    // Initialize theme
    this.theme.set(this.themeService.getCurrentTheme());

    // Subscribe to theme changes
    this.themeService.theme$.subscribe((newTheme) => {
      this.theme.set(newTheme);
    });

    // Subscribe to language changes
    this.languageService.getLanguage().subscribe((lang) => {
      this.language.set(lang);
    });
  }

  setTheme(newTheme: Theme) {
    this.themeService.setTheme(newTheme);
  }

  setLanguage(lang: Language) {
    this.languageService.setLanguage(lang);
    this.close();
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    if (this.isOpen()) {
      this.close();
    }
  }

  translate(key: keyof Translations): string {
    return this.translationService.translate(key);
  }
}
