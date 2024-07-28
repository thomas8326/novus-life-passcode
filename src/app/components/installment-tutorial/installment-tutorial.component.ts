import { Component } from '@angular/core';

@Component({
  selector: 'app-installment-tutorial',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col items-center w-full">
      <div class="flex-1 text-center my-2">
        我們有跟中租銀角零卡合作<br />
        不需要信用卡就可以分期付款<br />
        審核通過就能預先收到商品<br />
        還能輕鬆分攤購買金額減少一次性支付的壓力<br />
      </div>
      <div class="flex md:flex-row flex-col justify-between gap-8">
        <div class="flex-1 flex justify-center">
          <img
            class="w-full md:w-[80%] aspect-[3/4]"
            src="/assets/images/installment/S__3784714.jpg"
          />
        </div>
        <div class="flex-1 flex justify-center">
          <img
            class="w-full md:w-[80%] aspect-[3/4]"
            src="/assets/images/installment/S__3784716.jpg"
          />
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class InstallmentTutorialComponent {}
