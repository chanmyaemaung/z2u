import { Injectable, signal } from '@angular/core';
import { ToastConfig } from '@core/types/toast.types';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly DEFAULT_DURATION = 4000;
  toast = signal<ToastConfig | null>(null);

  show(config: ToastConfig): void {
    this.toast.set({
      type: 'info',
      duration: this.DEFAULT_DURATION,
      ...config,
    });

    if (!config.action) {
      setTimeout(() => {
        this.hide();
      }, config.duration || this.DEFAULT_DURATION);
    }
  }

  hide(): void {
    this.toast.set(null);
  }
}
