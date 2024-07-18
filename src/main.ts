import '@fontsource/open-sans'; // Defaults to weight 400
import '@fontsource/open-sans/400-italic.css'; // Specify weight and style
import '@fontsource/open-sans/400.css'; // Specify weight
import '@fontsource/playpen-sans';

import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

platformBrowser().bootstrapModule(AppModule, { ngZone: 'zone.js' });
