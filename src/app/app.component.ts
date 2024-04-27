import { Component, OnDestroy } from '@angular/core';
import { CrystalProductService } from 'src/app/services/crystal-product/crystal-product.service';
import { LifePassportDescriptionService } from 'src/app/services/life-passport/life-passport-description.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  private readonly allPassportDescription =
    this.lifePassportDescriptionService.listenAllPassportDescription();
  private readonly idCalculation =
    this.lifePassportDescriptionService.listenAllIdCalculations();

  constructor(
    private readonly lifePassportDescriptionService: LifePassportDescriptionService,
    private readonly crystalProductService: CrystalProductService,
  ) {
    this.allPassportDescription.subscribe();
    this.idCalculation.subscribe();
  }

  ngOnDestroy(): void {
    this.allPassportDescription.unsubscribe();
    this.idCalculation.unsubscribe();
  }
}
