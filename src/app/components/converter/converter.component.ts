import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { DetectedFont, FontType } from '@core/fonts/types/font.types';
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
  detectedFont = signal<DetectedFont>(null);
  inputMode = signal<Exclude<FontType, null>>('unicode');
  outputMode = signal<Exclude<FontType, null>>('zawgyi');
  inputText = signal('');
  outputText = computed(() => this.convertText());
  currentYear = new Date().getFullYear();

  constructor(
    private translationService: TranslationService,
    private converterService: ConverterService,
    private toastService: ToastService
  ) {}

  updateInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.inputText.set(input.value);

    if (input.value) {
      const isZawgyi = this.detectZawgyi(input.value);
      this.updateFontMode(isZawgyi);
    } else {
      this.detectedFont.set(null);
      this.mode.set('auto');
      this.inputMode.set('unicode');
    }
  }

  async pasteFromClipboard(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.inputText.set(text);

      if (text) {
        const isZawgyi = this.detectZawgyi(text);
        this.updateFontMode(isZawgyi);
      }
    } catch (error) {
      this.toastService.show({
        type: 'info',
        message: this.translate('toast.clipboard.error'),
        duration: 3000,
      });
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
    const containsMyanmar = /[\u1000-\u109F\uAA60-\uAA7F]/.test(text);
    if (!containsMyanmar) {
      return false;
    }

    const zawgyiPatterns = [
      '\u102c\u1039', // ခ်
      '\u103a\u1037', // ျ့
      '[\u103b\u107e-\u1084]', // ျ and variants
      '\u1033\u1094', // ု့
      '\u1034\u1094', // ူ့
      '\u1033\u1095', // ု့
      '\u1034\u1095', // ူ့
      '[\u1066-\u106f]', // Zawgyi-specific consonants
      '[\u1071-\u1074]', // Zawgyi-specific consonants
      '[\u1087-\u108f]', // Zawgyi-specific consonants
      '\u106a', // Zawgyi-specific consonants
      '\u1090', // တ
      '\u1092', // ဒ
      '\u1097', // ဗ
      '\u103c\u108a', // ြႊ
      '\u103d\u108a', // ွႊ
      '\u108a', // ႊ
      '\u106b', // ဋ
      '\u1091', // ဍ
      '\u106f', // ဏ
      '\u106e', // ဎ
      '\u1086', // ၆
      '\u104e\u1004\u103a\u1038', // ၎င်း
    ];

    const unicodePatterns = [
      '\u103e\u103b', // ှျ
      '\u103d\u103b', // ွျ
      '\u103b\u103d', // ျွ
      '\u103d\u103c', // ွြ
      '\u103b\u103c', // ျြ
      '\u103c\u103d', // ြွ
      '\u1031\u1039', // ေ + ္
      '\u1039[\u1000-\u1021]', // stacked consonants
    ];

    const zawgyiScore = this.countMatches(text, zawgyiPatterns);
    const unicodeScore = this.countMatches(text, unicodePatterns);

    console.log('Scores - Zawgyi:', zawgyiScore, 'Unicode:', unicodeScore);

    return zawgyiScore >= unicodeScore && zawgyiScore > 0;
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
        this.outputMode.set(detectedFont === 'zawgyi' ? 'unicode' : 'zawgyi');
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

    if (newMode === 'auto') {
      const text = this.inputText();
      if (text) {
        const isZawgyi = this.detectZawgyi(text);
        this.updateFontMode(isZawgyi);
      }
    }
  }

  setOutputMode(newMode: Exclude<FontType, null>): void {
    this.outputMode.set(newMode);
  }

  translate(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  private convertText(): string {
    const text = this.inputText();
    if (!text) return '';

    const currentMode = this.mode();
    const targetMode = this.outputMode();

    if (currentMode === 'auto') {
      const isZawgyi = this.detectZawgyi(text);
      return isZawgyi
        ? this.converterService.convertToUnicode(text)
        : this.converterService.convertToZawgyi(text);
    }

    if (currentMode === 'zawgyi' && targetMode === 'unicode') {
      return this.converterService.convertToUnicode(text);
    }

    if (currentMode === 'unicode' && targetMode === 'zawgyi') {
      return this.converterService.convertToZawgyi(text);
    }

    return text;
  }

  clearText(): void {
    this.inputText.set('');
    this.detectedFont.set(null);
    this.mode.set('auto');
    this.inputMode.set('unicode');
  }
}
