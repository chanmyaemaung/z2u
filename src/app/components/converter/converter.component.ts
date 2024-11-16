import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import {
  Language,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { unicodeToZawgyiRules, zawgyiToUnicodeRules } from '../../font';
import { LanguageService } from '../../services/language.service';
import { TranslationService } from '../../services/translation.service';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';

type Mode = 'auto' | 'zawgyi' | 'unicode';
type Font = 'zawgyi' | 'unicode';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, TranslateModule, SettingsModalComponent],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
})
export class ConverterComponent {
  mode = signal<Mode>('auto');
  outputMode = signal<Font>('unicode');
  inputText = signal('');
  currentLanguage = signal<Language>('en');

  convertedText = computed(() => {
    const input = this.inputText();
    if (!input) return '';

    const mode = this.mode();
    const outputMode = this.outputMode();

    if (mode === 'auto') {
      if (this.containsMyanmarText(input)) {
        const detectedFont = this.detectFont(input);
        return this.convert(input, detectedFont, outputMode);
      }
      return input;
    }

    return this.convert(input, mode as Font, outputMode);
  });

  constructor(
    private translateService: TranslateService,
    private languageService: LanguageService,
    private translationService: TranslationService
  ) {
    this.embedFonts();

    // Subscribe to language changes
    this.languageService.getLanguage().subscribe((lang) => {
      this.currentLanguage.set(lang);
      // Force re-render of translations
      this.forceUpdate();
    });

    // Watch for input changes and detect font
    effect(() => {
      const text = this.inputText();
      if (text && this.mode() === 'auto') {
        const detectedFont = this.detectFont(text);
        if (this.containsMyanmarText(text)) {
          this.mode.set(detectedFont);
        }
      }
    });
  }

  private containsMyanmarText(text: string): boolean {
    // Check if text contains Myanmar characters
    const myanmarRegex = /[\u1000-\u109F\uAA60-\uAA7F]/;
    return myanmarRegex.test(text);
  }

  private detectFont(text: string): Font {
    // Improved Zawgyi detection using common patterns
    const zawgyiPatterns = [
      '\u1031\u103b', // Zawgyi specific combination
      '\u1031\u103c',
      '[\u1022-\u1030\u1032-\u1039\u103b-\u103d]\u1039',
      '\u1039[^\u1000-\u1021]',
      '\u104e\u1004\u103a\u1038',
      '[\u1090-\u1099]',
      '\u1086',
      '\u1039\u1010\u103d',
      '\u1039\u1000-\u1021',
    ];

    const zawgyiRegex = new RegExp(zawgyiPatterns.join('|'));
    return zawgyiRegex.test(text) ? 'zawgyi' : 'unicode';
  }

  updateInput(value: string | Event) {
    let text: string;

    if (typeof value === 'string') {
      text = value;
    } else {
      const target = value.target as HTMLTextAreaElement;
      text = target.value;
    }

    this.inputText.set(text);

    // Auto detect font if in auto mode
    if (this.mode() === 'auto' && text) {
      if (this.containsMyanmarText(text)) {
        const detectedFont = this.detectFont(text);
        this.mode.set(detectedFont);
      }
    }
  }

  clearText() {
    this.inputText.set('');
    this.mode.set('auto');
  }

  outputText = computed(() => {
    const input = this.inputText();
    if (!input) return '';

    const mode = this.mode();
    const outputMode = this.outputMode();

    if (mode === 'auto') {
      // Auto detect logic here
      return this.convert(input, this.detectFont(input), outputMode);
    }

    return this.convert(input, mode as Font, outputMode);
  });

  private convert(text: string, from: Font, to: Font): string {
    if (from === to) return text;

    // Select rules based on conversion direction
    const rules =
      from === 'zawgyi' ? zawgyiToUnicodeRules : unicodeToZawgyiRules;

    // Apply each rule sequentially
    return rules.reduce((result, rule) => {
      const pattern = new RegExp(rule.from, 'g');
      return result.replace(pattern, rule.to);
    }, text);
  }

  setMode(newMode: Mode): void {
    this.mode.set(newMode);
  }

  setOutputMode(newMode: Font): void {
    this.outputMode.set(newMode);
  }

  // Helper method to copy text to clipboard
  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      // You can add a notification here if needed
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  async pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text && this.containsMyanmarText(text)) {
        const detectedFont = this.detectFont(text);

        // Set the input text
        this.inputText.set(text);

        // Update the input mode to match detected font
        this.mode.set(detectedFont);

        // Set output mode to opposite
        this.outputMode.set(detectedFont === 'zawgyi' ? 'unicode' : 'zawgyi');

        // Immediately update textarea font
        requestAnimationFrame(() => {
          this.updateTextareaFonts();
        });
      } else {
        this.inputText.set(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  }

  private updateTextareaFonts() {
    // Update input textarea
    const inputTextarea = document.querySelector('.input-section textarea');
    if (inputTextarea) {
      inputTextarea.classList.remove('zawgyi', 'unicode');
      inputTextarea.classList.add(this.mode());
    }

    // Update output textarea
    const outputTextarea = document.querySelector('.output-section textarea');
    if (outputTextarea) {
      outputTextarea.classList.remove('zawgyi', 'unicode');
      outputTextarea.classList.add(this.outputMode());
    }
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  private forceUpdate() {
    // Trigger change detection
    this.mode.set(this.mode());
  }

  private embedFonts() {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Zawgyi-One';
        src: url('/assets/fonts/ZawgyiOne.woff2') format('woff2'),
             url('/assets/fonts/ZawgyiOne.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Myanmar3';
        src: url('/assets/fonts/Myanmar3.woff2') format('woff2'),
             url('/assets/fonts/Myanmar3.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Pyidaungsu';
        src: url('/assets/fonts/Pyidaungsu.woff2') format('woff2'),
             url('/assets/fonts/Pyidaungsu.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }
}
