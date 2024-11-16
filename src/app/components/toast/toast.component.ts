import { CommonModule } from '@angular/common';
import { Component, computed, effect } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent {
  isVisible = computed(() => !!this.toastService.toast());

  constructor(public toastService: ToastService) {
    effect(() => {
      if (this.isVisible()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  getIconClass(): string {
    const type = this.toastService.toast()?.type;
    switch (type) {
      case 'success':
        return 'ph-check-circle';
      case 'error':
        return 'ph-x-circle';
      case 'warning':
        return 'ph-warning';
      case 'info':
      default:
        return 'ph-info';
    }
  }

  getToastClass(): string {
    return `toast ${this.toastService.toast()?.type || 'info'}`;
  }
}
