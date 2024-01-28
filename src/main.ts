import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import '@fontsource/open-sans'; // Defaults to weight 400
import '@fontsource/open-sans/400-italic.css'; // Specify weight and style
import '@fontsource/open-sans/400.css'; // Specify weight
import '@fontsource/playpen-sans';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
