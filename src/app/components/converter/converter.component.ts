import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { unicodeToZawgyiRules, zawgyiToUnicodeRules } from '../../font';

type Mode = 'auto' | 'zawgyi' | 'unicode';
type Font = 'zawgyi' | 'unicode';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
})
export class ConverterComponent {
  mode = signal<Mode>('auto');
  outputMode = signal<Font>('unicode');
  inputText = signal('');

  constructor() {
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
    // Improved Zawgyi detection with more specific patterns
    const zawgyiPatterns = [
      '\u103b[\u1000-\u1021]\u103c', // Zawgyi specific medial combinations
      '\u1031\u103b', // Zawgyi specific vowel order
      '[\u1040-\u1049][\u102b-\u103f]', // Zawgyi specific digit combinations
      '\u1031[\u103b\u107e-\u1084]', // Zawgyi specific combinations
      '[\u1064-\u1097]', // Zawgyi specific characters
    ];

    // Join patterns with OR operator
    const zawgyiRegex = new RegExp(zawgyiPatterns.join('|'));

    // If any Zawgyi pattern matches, consider it Zawgyi
    return zawgyiRegex.test(text) ? 'zawgyi' : 'unicode';
  }

  updateInput(value: string): void {
    this.inputText.set(value);

    // If in auto mode, detect font immediately
    if (this.mode() === 'auto' && this.containsMyanmarText(value)) {
      const detectedFont = this.detectFont(value);
      this.mode.set(detectedFont);
    }
  }

  clearText(): void {
    this.inputText.set('');
    if (this.mode() !== 'auto') {
      this.mode.set('auto');
    }
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

  async pasteFromClipboard(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.updateInput(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  }
}
