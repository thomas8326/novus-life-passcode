import { bootstrapApplication } from '@angular/platform-browser';
import '@fontsource-variable/noto-sans-tc';
import '@fontsource/spectral';
import { AppComponent } from 'src/app/app.component';
import { appConfig } from 'src/app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
