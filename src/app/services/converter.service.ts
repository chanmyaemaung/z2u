import { Injectable } from '@angular/core';

import { unicodeToZawgyiRules } from '@core/fonts/rules/unicode-zawgyi.rules';
import { zawgyiToUnicodeRules } from '@core/fonts/rules/zawgyi-unicode.rules';
import { Rule } from '../core/fonts/types/font.types';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  convertToUnicode(text: string): string {
    return this.convert(text, zawgyiToUnicodeRules);
  }

  convertToZawgyi(text: string): string {
    return this.convert(text, unicodeToZawgyiRules);
  }

  private convert(text: string, rules: Rule[]): string {
    return rules.reduce<string>((result: string, rule: Rule): string => {
      const pattern = new RegExp(rule.from, 'g');
      return result.replace(pattern, rule.to);
    }, text);
  }
}
