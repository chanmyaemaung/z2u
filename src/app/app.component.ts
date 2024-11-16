import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { ConverterComponent } from './components/converter/converter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConverterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  ogImageUrl = `${environment.baseUrl}/assets/og-image.png`;
}
