import { Injectable } from '@angular/core';

import { unicodeToZawgyiRules } from '@core/fonts/rules/unicode-zawgyi.rules';
import { zawgyiToUnicodeRules } from '@core/fonts/rules/zawgyi-unicode.rules';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  private compiledZawgyiRules: Array<{ pattern: RegExp; to: string }>;
  private compiledUnicodeRules: Array<{ pattern: RegExp; to: string }>;

  constructor() {
    this.compiledZawgyiRules = this.compileRules(zawgyiToUnicodeRules);
    this.compiledUnicodeRules = this.compileRules(unicodeToZawgyiRules);
  }

  private compileRules(
    rules: Array<{ from: string; to: string }>
  ): Array<{ pattern: RegExp; to: string }> {
    return rules.map((rule) => ({
      pattern: new RegExp(rule.from, 'g'),
      to: rule.to,
    }));
  }

  convertToUnicode(text: string): string {
    return this.convert(text, this.compiledZawgyiRules);
  }

  convertToZawgyi(text: string): string {
    return this.convert(text, this.compiledUnicodeRules);
  }

  private convert(
    text: string,
    rules: Array<{ pattern: RegExp; to: string }>
  ): string {
    return rules.reduce((result, rule) => {
      return result.replace(rule.pattern, rule.to);
    }, text);
  }
}
