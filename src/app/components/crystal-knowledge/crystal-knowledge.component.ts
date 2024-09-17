import { Component, model } from '@angular/core';
import { CheckboxComponent } from 'src/app/components/checkbox/checkbox.component';

@Component({
  selector: 'app-crystal-knowledge',
  imports: [CheckboxComponent],
  standalone: true,
  template: `
    <div
      class="bg-[#e5d1b9] p-6 rounded-lg w-full mx-auto flex flex-col justify-center"
    >
      <h1
        class="text-3xl font-bold text-amber-700 mb-4 text-center drop-shadow shadow-white"
        [style]="
          'textShadow: 1px 1px 1px white, -1px -1px 1px white, 1px -1px 1px white, -1px 1px 1px white'
        "
      >
        水晶小常識
      </h1>

      <p
        class="text-amber-600 mb-6 text-center"
        [style]="
          'textShadow: 1px 1px 1px white, -1px -1px 1px white, 1px -1px 1px white, -1px 1px 1px white'
        "
      >
        天然水晶不同於人造製品<br />
        晶體內部都會有表面礦缺、平珠、共生物<br />
        是水晶在天然的生長過程中所遇到<br />
        比如地殼運動或種種因素所形成的<br />
        這也是天然水晶中的自然美感，<br />
        不同於玻璃或是塑膠的死板
      </p>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="font-bold mb-2">礦缺</h2>
          <div class="w-20 h-20 bg-purple-600 rounded-full mx-auto"></div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="font-bold mb-2">平珠</h2>
          <div class="w-20 h-20 bg-blue-300 rounded-full mx-auto"></div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="font-bold mb-2">共生</h2>
          <div class="w-20 h-20 bg-orange-300 rounded-full mx-auto"></div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="font-bold mb-2">冰紋 冰霧</h2>
          <div class="w-20 h-20 bg-purple-400 rounded-full mx-auto"></div>
        </div>
      </div>
      <label
        class="text-amber-600 mb-6 flex items-center justify-end gap-2 my-4 cursor-pointer"
        [style]="
          'textShadow: 1px 1px 1px white, -1px -1px 1px white, 1px -1px 1px white, -1px 1px 1px white'
        "
      >
        <app-checkbox [(checked)]="checked"></app-checkbox>
        <span>我了解並同意上述資訊</span>
      </label>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: Arial, sans-serif;
      }
    `,
  ],
})
export class CrystalKnowledgeComponent {
  checked = model(false);
}
