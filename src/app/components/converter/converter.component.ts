import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FontType } from '@core/fonts/types/font.types';
import { TranslationKey } from '@core/i18n/types/translation.types';
import { TranslateModule } from '@ngx-translate/core';
import { ConverterService } from 'src/app/services/converter.service';
import { ToastService } from 'src/app/services/toast.service';
import { TranslationService } from 'src/app/services/translation.service';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';
import { ToastComponent } from '../toast/toast.component';

type Mode = 'auto' | 'zawgyi' | 'unicode';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SettingsModalComponent,
    ToastComponent,
  ],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
})
export class ConverterComponent {
  readonly TRANSLATION_KEYS = {
    TITLE: 'converter.title' as TranslationKey,
    SUBTITLE: 'converter.subtitle' as TranslationKey,
    INPUT: 'converter.input' as TranslationKey,
    OUTPUT: 'converter.output' as TranslationKey,
    INPUT_PLACEHOLDER: 'converter.input.placeholder' as TranslationKey,
    OUTPUT_PLACEHOLDER: 'converter.output.placeholder' as TranslationKey,
    PASTE: 'converter.paste' as TranslationKey,
    CLEAR: 'converter.clear' as TranslationKey,
    MODE_AUTO: 'converter.mode.auto' as TranslationKey,
    MODE_ZAWGYI: 'converter.mode.zawgyi' as TranslationKey,
    MODE_UNICODE: 'converter.mode.unicode' as TranslationKey,
  } as const;

  mode = signal<Mode>('auto');
  detectedFont = signal<FontType>(null);
  inputMode = signal<Exclude<FontType, null>>('unicode');
  outputMode = signal<'zawgyi' | 'unicode'>('unicode');
  inputText = signal('');
  outputText = signal('');
  currentYear = new Date().getFullYear();
  isZawgyiOutput: boolean = false;

  private readonly FONTS = {
    UNICODE: 'Noto Sans Myanmar',
    ZAWGYI: 'Noto Zawgyi',
  } as const;

  constructor(
    private translationService: TranslationService,
    private converterService: ConverterService,
    private toastService: ToastService
  ) {}

  async updateInput(event: Event): Promise<void> {
    const text = (event.target as HTMLTextAreaElement).value;
    this.inputText.set(text);

    if (this.containsMyanmarText(text)) {
      const isZawgyi = this.detectZawgyi(text);
      this.updateFontMode(isZawgyi);

      // Convert and update output
      if (isZawgyi) {
        const converted = this.converterService.convertToUnicode(text);
        this.outputText.set(converted);
      } else {
        const converted = this.converterService.convertToZawgyi(text);
        this.outputText.set(converted);
      }
    }
  }

  async pasteFromClipboard(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;

      this.inputText.set(text);

      // Only process if text contains Myanmar characters
      if (this.containsMyanmarText(text)) {
        const isZawgyi = this.detectZawgyi(text);
        this.updateFontMode(isZawgyi);

        // Convert based on current mode
        switch (this.mode()) {
          case 'auto':
            this.convertAutoMode(text, isZawgyi);
            break;
          case 'zawgyi':
            this.outputText.set(this.converterService.convertToUnicode(text));
            this.outputMode.set('unicode');
            break;
          case 'unicode':
            this.outputText.set(this.converterService.convertToZawgyi(text));
            this.outputMode.set('zawgyi');
            break;
        }
      }
    } catch (error) {
      this.toastService.show({
        type: 'info',
        message: this.translate('toast.clipboard.error'),
        duration: 3000,
      });
    }
  }

  // Helper method for auto mode conversion
  private convertAutoMode(text: string, isZawgyi: boolean): void {
    if (isZawgyi) {
      this.outputText.set(this.converterService.convertToUnicode(text));
      this.outputMode.set('unicode');
    } else {
      this.outputText.set(this.converterService.convertToZawgyi(text));
      this.outputMode.set('zawgyi');
    }
  }

  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.toastService.show({
        type: 'success',
        message: this.translate('toast.copy.success'),
        duration: 2000,
      });
    } catch (error) {
      this.toastService.show({
        type: 'error',
        message: this.translate('toast.copy.error'),
        duration: 3000,
      });
    }
  }

  private detectZawgyi(text: string): boolean {
    const myanmarSegments = text.match(/[\u1000-\u109F\uAA60-\uAA7F]+/g);
    if (!myanmarSegments) return false;

    const myanmarText = myanmarSegments.join('');

    // Unicode specific patterns (if these exist, it's definitely Unicode)
    const unicodePatterns = [
      '\u103e\u103b', // ှျ
      '\u103d\u103b', // ွျ
      '\u103b\u103d', // ျွ
      '\u103d\u103c', // ွြ
      '\u103b\u103c', // ျြ
      '\u103c\u103d', // ြွ
      '\u1031\u1039', // ေ့
      '\u1039[\u1000-\u1021]', // စျန္
    ];

    // Check for Unicode patterns first
    if (
      unicodePatterns.some((pattern) => new RegExp(pattern).test(myanmarText))
    ) {
      return false; // It's Unicode
    }

    // Zawgyi specific patterns
    const zawgyiPatterns = [
      '[\u102b-\u1030\u1032-\u1039\u103b-\u103e\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f\u109a-\u109d]',
      '\u104e\u1044', // Zawgyi specific ၎င်း
      '\u1031$', // ေ at the end
      '\u1031[^\u1000-\u1021\u103b\u1040\u106a]', // ေ not followed by consonant
      '[\u1040-\u1049][\u102b-\u103e]', // Zawgyi number + medial
      '\u1031[\u103b\u107e-\u1084]', // Zawgyi specific ေ + medial
    ];

    // Count Zawgyi patterns
    const zawgyiScore = zawgyiPatterns.reduce((count, pattern) => {
      const matches = myanmarText.match(new RegExp(pattern, 'g'));
      return count + (matches ? matches.length : 0);
    }, 0);

    return zawgyiScore > 0; // If any Zawgyi pattern found
  }

  private calculateZawgyiScore(text: string): number {
    const zawgyiPatterns = [
      '\u102c\u1039', // Specific Zawgyi combination
      '\u103a\u1037', // Specific Zawgyi combination
      '[\u103b\u107e-\u1084]', // Zawgyi consonants
      '\u1033\u1094', // Specific Zawgyi combination
      '\u1034\u1094', // Specific Zawgyi combination
      '[\u1066-\u106f]', // Zawgyi specific characters
      '[\u1071-\u1074]', // Zawgyi specific characters
      '[\u1087-\u108f]', // Zawgyi specific characters
      '\u106a', // Specific Zawgyi character
      '\u1090', // Specific Zawgyi character
      '\u1092', // Specific Zawgyi character
      '\u1097', // Specific Zawgyi character
      '\u1031$', // Zawgyi specific pattern (at end)
      '\u1031[\u103b\u107e-\u1084]', // Zawgyi specific combination
    ];

    const matches = this.countMatches(text, zawgyiPatterns);
    return matches / text.length;
  }

  private calculateUnicodeScore(text: string): number {
    const unicodePatterns = [
      '\u103e\u103b',
      '\u103d\u103b',
      '\u103b\u103d',
      '\u103d\u103c',
      '\u103b\u103c',
      '\u103c\u103d',
      '\u1031\u1039',
      '\u1039[\u1000-\u1021]',
    ];

    return this.countMatches(text, unicodePatterns) / text.length;
  }

  private countMatches(text: string, patterns: string[]): number {
    let totalCount = 0;
    patterns.forEach((pattern) => {
      const regex = new RegExp(pattern, 'g');
      const matches = text.match(regex);
      if (matches) {
        totalCount += matches.length;
      }
    });
    return totalCount;
  }

  private updateFontMode(isZawgyi: boolean): void {
    if (this.containsMyanmarText(this.inputText())) {
      const detectedFont = isZawgyi ? 'zawgyi' : 'unicode';
      this.detectedFont.set(detectedFont);

      if (this.mode() === 'auto') {
        this.inputMode.set(detectedFont);
        // Set output mode to opposite of input
        this.outputMode.set(detectedFont === 'zawgyi' ? 'unicode' : 'zawgyi');

        // Convert text based on detected font
        const text = this.inputText();
        if (detectedFont === 'zawgyi') {
          this.outputText.set(this.converterService.convertToUnicode(text));
        } else {
          this.outputText.set(this.converterService.convertToZawgyi(text));
        }
      }
    } else {
      this.detectedFont.set(null);
    }
  }

  private containsMyanmarText(text: string): boolean {
    return /[\u1000-\u109F\uAA60-\uAA7F]/.test(text);
  }

  getButtonClass(fontType: 'zawgyi' | 'unicode'): string {
    const classes: string[] = [];

    if (
      this.mode() === fontType ||
      (this.mode() === 'auto' && this.detectedFont() === fontType)
    ) {
      classes.push('active');
    }

    if (this.mode() === 'auto' && this.detectedFont() === fontType) {
      classes.push('detected');
    }

    return classes.join(' ');
  }

  getAutoButtonClass(): string {
    return this.mode() === 'auto' && !this.detectedFont() ? 'active' : '';
  }

  isDetected(fontType: Exclude<FontType, null>): boolean {
    return this.mode() === 'auto' && this.detectedFont() === fontType;
  }

  setMode(newMode: Mode): void {
    this.mode.set(newMode);
    const text = this.inputText();

    if (text) {
      if (newMode === 'auto') {
        const isZawgyi = this.detectZawgyi(text);
        this.updateFontMode(isZawgyi);
      } else if (newMode === 'zawgyi') {
        // If switching to Zawgyi mode
        this.inputMode.set('zawgyi');
        this.outputMode.set('unicode');
        this.outputText.set(this.converterService.convertToUnicode(text));
      } else {
        // If switching to Unicode mode
        this.inputMode.set('unicode');
        this.outputMode.set('zawgyi');
        this.outputText.set(this.converterService.convertToZawgyi(text));
      }
    } else {
      // Reset modes when no text
      if (newMode !== 'auto') {
        this.inputMode.set(newMode);
        this.outputMode.set(newMode === 'zawgyi' ? 'unicode' : 'zawgyi');
      }
    }
  }

  setOutputMode(newMode: Exclude<FontType, null>): void {
    this.outputMode.set(newMode);

    // Update input mode to opposite of output mode
    const oppositeMode = newMode === 'zawgyi' ? 'unicode' : 'zawgyi';
    this.inputMode.set(oppositeMode);
    this.mode.set(oppositeMode);

    // Convert text based on new mode if there's input
    if (this.inputText()) {
      const text = this.inputText();
      if (newMode === 'zawgyi') {
        this.convert(text, 'unicode2zawgyi');
      } else {
        this.convert(text, 'zawgyi2unicode');
      }
    }
  }

  translate(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  clearText(): void {
    this.inputText.set('');
    this.outputText.set('');
    this.detectedFont.set(null);
    this.mode.set('auto');
    this.inputMode.set('unicode');
  }

  onModeChange(mode: 'zawgyi2unicode' | 'unicode2zawgyi') {
    this.isZawgyiOutput = mode === 'unicode2zawgyi';
  }

  convert(text: string, mode: 'zawgyi2unicode' | 'unicode2zawgyi'): void {
    if (mode === 'zawgyi2unicode') {
      const converted = this.converterService.convertToUnicode(text);
      this.outputText.set(converted);
      this.outputMode.set('unicode');
    } else {
      const converted = this.converterService.convertToZawgyi(text);
      this.outputText.set(converted);
      this.outputMode.set('zawgyi');
    }
  }

  getInputFontClass(): string {
    return this.inputMode() === 'zawgyi' ? 'zawgyi-font' : 'unicode-font';
  }

  getOutputFontClass(): string {
    return this.outputMode() === 'zawgyi' ? 'zawgyi-font' : 'unicode-font';
  }
}
