import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">服務條款</h1>
      <p class="text-sm text-gray-600 mb-4">最後更新日期： {{ lastUpdated }}</p>

      <p class="mb-6">
        歡迎使用
        {{
          websiteName
        }}（以下稱「本網站」或「我們」）提供的服務。使用本網站前，請仔細閱讀以下服務條款（以下稱「本條款」）。使用本網站即表示您同意遵守本條款。
      </p>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-gray-700">1. 接受條款</h2>
        <p>
          使用本網站，即表示您同意受本條款的約束。如果您不同意本條款，請勿使用本網站。
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-gray-700">2. 服務描述</h2>
        <p>
          本網站提供
          {{
            serviceDescription
          }}。我們保留隨時修改或中斷服務的權利，恕不另行通知。
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-gray-700">3. 使用規則</h2>
        <ul class="list-disc pl-5 space-y-2">
          <li>
            <strong class="font-medium">合法使用</strong
            >：您同意僅以合法目的使用本網站，且不得從事任何可能損害、禁用、負載過重或損壞本網站的行為。
          </li>
          <li>
            <strong class="font-medium">禁止行為</strong
            >：不得上傳任何非法、侵權、誹謗、淫穢或其他不當內容。
          </li>
        </ul>
      </section>

      <!-- 其他條款項目省略，實際使用時請添加完整內容 -->

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-gray-700">13. 聯絡我們</h2>
        <p>如對本條款有任何疑問，請聯絡我們：</p>
        <ul class="list-disc pl-5 space-y-2">
          <li>
            電子郵件：<a
              href="mailto:{{ contactEmail }}"
              class="text-blue-600 hover:underline"
              >{{ contactEmail }}</a
            >
          </li>
          <li>地址：{{ companyAddress }}</li>
        </ul>
      </section>
    </div>
  `,
})
export class TermsOfServiceComponent {
  lastUpdated = '2024/09/18';
  websiteName = 'Novus 晶礦人生';
  serviceDescription =
    '本網站提供各類水晶產品的銷售，以及專業的算命和占卜服務。我們致力於為用戶提供高品質的產品和個性化的服務，協助您探索自我、提升生活品質。我們保留隨時修改或中斷服務的權利，恕不另行通知。';
  contactEmail = '131419snm@gmail.com';
  companyAddress = '103台北市大同區長安西路191號';
}
