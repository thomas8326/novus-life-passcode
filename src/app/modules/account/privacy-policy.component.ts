import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-3xl font-bold mb-6">隱私權政策</h1>
      <p class="text-sm text-gray-600 mb-6">最後更新日期：{{ lastUpdated }}</p>

      <p class="mb-4">
        本隱私權政策描述了我們在您使用本服務時，對您的資訊之收集、使用和披露的政策與程序，並告知您關於您的隱私權以及法律如何保護您。
      </p>

      <p class="mb-4">
        我們使用您的個人資料來提供和改進本服務。使用本服務即表示您同意按照本隱私權政策收集和使用資訊。本隱私權政策是透過隱私權政策產生器製作。
      </p>

      <h2 class="text-2xl font-semibold mt-6 mb-4">解釋與定義</h2>

      <h3 class="text-xl font-semibold mt-4 mb-2">解釋</h3>
      <p class="mb-4">
        首字母大寫的詞語具有下列條款所定義的含義。以下定義無論以單數或複數形式出現，均具有相同的意義。
      </p>

      <h3 class="text-xl font-semibold mt-4 mb-2">定義</h3>
      <p class="mb-2">就本隱私權政策而言：</p>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>
          <strong>帳戶</strong
          >：指為您創建的獨特帳戶，以訪問我們的服務或我們服務的部分內容。
        </li>
        <li>
          <strong>關係企業</strong
          >：指控制、受控於或與一方共同控制的實體，其中「控制」是指擁有50％以上有權投票選舉董事或其他管理權威的股份、股權或其他證券。
        </li>
        <li>
          <strong>公司</strong
          >（在本協議中稱為「公司」、「我們」或「本公司」）：指
          {{ companyName }}。
        </li>
        <li>
          <strong>Cookies</strong
          >：是由網站放置在您的電腦、行動裝置或任何其他裝置上的小型文件，包含您的瀏覽歷史記錄詳細資訊及其多種用途。
        </li>
        <li><strong>國家</strong>：指 {{ country }}。</li>
        <li>
          <strong>裝置</strong
          >：指任何可訪問本服務的裝置，例如電腦、手機或數位平板。
        </li>
        <li>
          <strong>個人資料</strong>：指與已識別或可識別的個人相關的任何資訊。
        </li>
        <li><strong>服務</strong>：指 {{ serviceName }}。</li>
        <li>
          <strong>服務供應商</strong
          >：指代表公司處理資料的任何自然人或法人。這是指公司聘用的第三方公司或個人，以促進服務、代表公司提供服務、執行與服務相關的服務或協助公司分析服務的使用方式。
        </li>
        <li>
          <strong>使用資料</strong
          >：指自動收集的資料，無論是由使用服務產生或來自服務基礎設施本身（例如頁面訪問的持續時間）。
        </li>
        <li>
          <strong>網站</strong>：指 {{ websiteName }}，網址為 {{ websiteUrl }}
        </li>
        <li>
          <strong>您</strong
          >：指訪問或使用本服務的個人，或代表該個人訪問或使用本服務的公司或其他法律實體，視情況而定。
        </li>
      </ul>

      <h2 class="text-2xl font-semibold mt-6 mb-4">收集和使用您的個人資料</h2>

      <h3 class="text-xl font-semibold mt-4 mb-2">收集的資料類型</h3>

      <h4 class="text-lg font-semibold mt-3 mb-2">個人資料</h4>
      <p class="mb-2">
        在使用我們的服務時，我們可能會要求您提供可用於聯繫或識別您的某些個人身份資訊。個人身份資訊可能包括但不限於：
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>電子郵件地址</li>
        <li>姓名和名字</li>
        <li>使用資料</li>
      </ul>

      <h4 class="text-lg font-semibold mt-3 mb-2">使用資料</h4>
      <p class="mb-4">使用資料在使用本服務時自動收集。</p>
      <p class="mb-2">
        使用資料可能包括您的裝置的網際網路協定位址（例如 IP
        位址）、瀏覽器類型、瀏覽器版本、您訪問我們服務的頁面、訪問的時間和日期、在這些頁面上花費的時間、唯一裝置識別碼和其他診斷資料。
      </p>
      <p class="mb-4">
        當您透過行動裝置訪問本服務時，我們可能會自動收集某些資訊，包括但不限於您使用的行動裝置類型、您的行動裝置唯一
        ID、您的行動裝置的 IP
        位址、您的行動作業系統、您使用的行動網路瀏覽器類型、唯一裝置識別碼和其他診斷資料。
      </p>
      <p class="mb-4">
        我們還可能收集您的瀏覽器在您訪問我們的服務時或當您透過行動裝置訪問本服務時發送的資訊。
      </p>

      <h3 class="text-xl font-semibold mt-4 mb-2">追蹤技術與 Cookies</h3>
      <p class="mb-4">
        我們使用 Cookies
        和類似的追蹤技術來追蹤我們服務上的活動並儲存某些資訊。我們使用的追蹤技術包括信標、標籤和腳本，以收集和追蹤資訊並改進和分析我們的服務。我們使用的技術可能包括：
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>
          <strong>Cookies 或瀏覽器 Cookies</strong>：Cookie
          是放置在您的裝置上的一個小型文件。您可以指示您的瀏覽器拒絕所有 Cookies
          或指示何時發送 Cookie。但是，如果您不接受
          Cookies，您可能無法使用我們服務的某些部分。除非您已調整瀏覽器設定以拒絕
          Cookies，否則我們的服務可能使用 Cookies。
        </li>
        <li>
          <strong>網路信標</strong
          >：我們服務的某些部分和我們的電子郵件可能包含稱為網路信標（也稱為透明
          GIF、像素標籤和單像素
          GIF）的微小電子文件，使公司能夠例如計算訪問這些頁面或打開電子郵件的用戶，以及其他相關的網站統計資料（例如記錄某個部分的受歡迎程度並驗證系統和服務器的完整性）。
        </li>
      </ul>

      <p class="mb-4">
        Cookies 可以是「持久性」或「會話性」Cookies。持久性 Cookies
        當您離線時保留在您的個人電腦或行動裝置上，而會話性 Cookies
        在您關閉網路瀏覽器時被刪除。
      </p>

      <p class="mb-4">我們為以下目的使用會話性和持久性 Cookies：</p>

      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>
          <strong>必要的 / 基本的 Cookies</strong><br />
          類型：會話性 Cookies<br />
          管理者：我們<br />
          目的：這些 Cookies
          對於向您提供通過網站提供的服務以及使您能夠使用其某些功能至關重要。它們有助於驗證用戶並防止用戶帳戶的欺詐性使用。沒有這些
          Cookies，您請求的服務將無法提供，我們僅使用這些 Cookies
          向您提供這些服務。
        </li>
        <li>
          <strong>Cookies 政策 / 通知接受 Cookies</strong><br />
          類型：持久性 Cookies<br />
          管理者：我們<br />
          目的：這些 Cookies 識別用戶是否已接受網站上的 Cookies 使用。
        </li>
        <li>
          <strong>功能性 Cookies</strong><br />
          類型：持久性 Cookies<br />
          管理者：我們<br />
          目的：這些 Cookies
          使我們能夠在您使用網站時記住您所做的選擇，例如記住您的登入詳細資訊或語言偏好。這些
          Cookies
          的目的是為您提供更個性化的體驗，並避免您每次使用網站時都必須重新輸入您的偏好設定。
        </li>
      </ul>

      <h2 class="text-2xl font-semibold mt-6 mb-4">使用您的個人資料</h2>

      <p class="mb-4">公司可能將個人資料用於以下目的：</p>

      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li><strong>提供和維護我們的服務</strong>：包括監控我們服務的使用。</li>
        <li>
          <strong>管理您的帳戶</strong
          >：管理您作為服務使用者的註冊。您提供的個人資料可以讓您訪問作為註冊用戶可用的服務的不同功能。
        </li>
        <li>
          <strong>履行合約</strong
          >：開發、遵守和執行您透過服務購買的產品、物品或服務的購買合約或與我們之間的任何其他合約。
        </li>
        <li>
          <strong>聯絡您</strong
          >：透過電子郵件、電話、簡訊或其他等效的電子通訊方式（如行動應用程式的推播通知）與您聯繫，提供關於功能、產品或已簽約服務的更新或資訊性通訊，包括安全更新，必要時或合理地實施。
        </li>
        <li>
          <strong>向您提供資訊</strong
          >：除非您已選擇不接收此類資訊，否則向您提供我們提供的其他商品、服務和活動的新聞、特別優惠和一般資訊，這些商品、服務和活動與您已購買或詢問的類似。
        </li>
        <li><strong>管理您的請求</strong>：處理並管理您向我們提出的請求。</li>
        <li>
          <strong>業務轉移</strong
          >：我們可能會在評估或進行合併、剝離、重組、重組、解散或其他出售或轉讓我們部分或全部資產時使用您的資訊，無論是作為持續經營還是作為破產、清算或類似程序的一部分，其中我們持有的關於服務使用者的個人資料是轉讓的資產之一。
        </li>
        <li>
          <strong>其他目的</strong
          >：我們可能將您的資訊用於其他目的，例如資料分析、識別使用趨勢、確定我們促銷活動的有效性以及評估和改進我們的服務、產品、服務、行銷和您的體驗。
        </li>
      </ul>

      <p class="mb-4">我們可能在以下情況下分享您的個人資訊：</p>

      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>
          <strong>與服務供應商</strong
          >：我們可能與服務供應商分享您的個人資訊，以監控和分析我們服務的使用，並與您聯繫。
        </li>
        <li>
          <strong>業務轉移</strong
          >：在任何合併、公司資產出售、融資或將我們全部或部分業務出售或轉讓給另一家公司時，我們可能分享或轉讓您的個人資訊。
        </li>
        <li>
          <strong>與關係企業</strong
          >：我們可能與我們的關係企業分享您的資訊，在這種情況下，我們將要求這些關
        </li>
        <li>
          <strong>與關係企業</strong
          >：我們可能與我們的關係企業分享您的資訊，在這種情況下，我們將要求這些關係企業遵守本隱私權政策。關係企業包括我們的母公司和任何其他子公司、合資夥伴或我們控制或與我們共同控制的其他公司。
        </li>
        <li>
          <strong>與商業夥伴</strong
          >：我們可能與商業夥伴分享您的資訊，以向您提供某些產品、服務或促銷活動。
        </li>
        <li>
          <strong>與其他用戶</strong
          >：當您與其他用戶在公共區域共享個人資訊或以其他方式互動時，此類資訊可能被所有用戶查看，並可能在公共場合傳播。
        </li>
        <li>
          <strong>經您的同意</strong
          >：在您同意的情況下，我們可能為任何其他目的披露您的個人資訊。
        </li>
      </ul>

      <h2 class="text-2xl font-semibold mt-6 mb-4">保留您的個人資料</h2>

      <p class="mb-4">
        公司將僅在本隱私權政策所述目的所需的期間內保留您的個人資料。我們將在必要的範圍內保留並使用您的個人資料，以遵守我們的法律義務（例如，如果我們需要保留您的資料以遵守適用的法律）、解決爭議並執行我們的法律協議和政策。
      </p>

      <p class="mb-4">
        公司還將為內部分析目的保留使用資料。除非此資料用於加強我們服務的安全性或改進其功能，否則使用資料通常會保留較短的時間，或者我們因法律義務需要更長時間保留此資料。
      </p>

      <h2 class="text-2xl font-semibold mt-6 mb-4">轉移您的個人資料</h2>

      <p class="mb-4">
        您的資訊，包括個人資料，在公司運營辦公室和參與處理的各方所在的任何其他地點進行處理。這意味著此資訊可能會被轉移到並維護在您所在的州、省、國家或其他政府管轄區之外的電腦上，這些地區的資料保護法律可能與您所在的管轄區不同。
      </p>

      <p class="mb-4">
        您對本隱私權政策的同意以及您提交此類資訊即表示您同意進行此轉移。
      </p>

      <p class="mb-4">
        公司將採取一切合理必要的步驟，以確保您的資料得到安全處理，並符合本隱私權政策，除非有適當的控制措施，包括您的資料和其他個人資訊的安全，否則不會將您的個人資料轉移到任何組織或國家。
      </p>

      <h2 class="text-2xl font-semibold mt-6 mb-4">刪除您的個人資料</h2>

      <p class="mb-4">
        您有權刪除或請求我們協助刪除我們已收集關於您的個人資料。
      </p>

      <p class="mb-4">我們的服務可能使您能夠在服務內刪除有關您的某些資訊。</p>

      <p class="mb-4">
        您可以隨時登入您的帳戶（如果您有帳戶）並訪問帳戶設定部分，管理您的個人資訊，來更新、更改或刪除您的資訊。您也可以聯絡我們，請求訪問、更正或刪除您提供給我們的任何個人資訊。
      </p>

      <p class="mb-4">
        但是，請注意，當我們有法律義務或合法依據時，我們可能需要保留某些資訊。
      </p>

      <h2 class="text-2xl font-semibold mt-6 mb-4">披露您的個人資料</h2>

      <h3 class="text-xl font-semibold mt-4 mb-2">業務交易</h3>
      <p class="mb-4">
        如果公司涉及合併、收購或資產出售，您的個人資料可能會被轉移。我們將在您的個人資料被轉移並受不同的隱私權政策約束之前，向您提供通知。
      </p>

      <h3 class="text-xl font-semibold mt-4 mb-2">法律執法</h3>
      <p class="mb-4">
        在某些情況下，如果法律要求或應公眾機關的有效要求（例如法院或政府機構），公司可能需要披露您的個人資料。
      </p>

      <h3 class="text-xl font-semibold mt-4 mb-2">其他法律要求</h3>
      <p class="mb-4">
        公司可能在真誠地相信此類行動是必要的情況下披露您的個人資料，以：
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>遵守法律義務</li>
        <li>保護和捍衛公司的權利或財產</li>
        <li>防止或調查與服務有關的可能的不當行為</li>
        <li>保護服務使用者或公眾的人身安全</li>
        <li>防止承擔法律責任</li>
      </ul>

      <h2 class="text-2xl font-semibold mt-6 mb-4">您的個人資料的安全性</h2>

      <p class="mb-4">
        您的個人資料的安全對我們非常重要，但請記住，互聯網上的傳輸或電子存儲的方法並非
        100%
        安全。雖然我們努力使用商業上可接受的手段來保護您的個人資料，但我們無法保證其絕對安全性。
      </p>

      <h2 class="text-2xl font-semibold mt-6 mb-4">兒童隱私</h2>

      <p class="mb-4">
        我們的服務不針對13歲以下的任何人。我們不會故意收集13歲以下任何人的個人身份資訊。如果您是父母或監護人，並且您知道您的孩子向我們提供了個人資料，請聯絡我們。如果我們發現我們在未經父母同意的情況下從13歲以下的任何人那裡收集了個人資料，我們將採取步驟從我們的服務器中刪除該資訊。
      </p>

      <p class="mb-4">
        如果我們需要依賴同意作為處理您的資訊的法律依據，而您的國家要求父母同意，我們可能需要您的父母同意才能收集和使用該資訊。
      </p>

      <h2 class="text-2xl font-semibold mt-6 mb-4">連結到其他網站</h2>

      <p class="mb-4">
        我們的服務可能包含非我們運營的其他網站的連結。如果您點擊第三方連結，您將被引導至該第三方的網站。我們強烈建議您查看您訪問的每個網站的隱私權政策。
      </p>

      <p class="mb-4">
        我們無法控制也不承擔任何第三方網站或服務的內容、隱私權政策或實踐的責任。
      </p>

      <h2 class="text-2xl font-semibold mt-6 mb-4">本隱私權政策的變更</h2>

      <p class="mb-4">
        我們可能會不時更新我們的隱私權政策。我們將在此頁面上發布新的隱私權政策來通知您任何變更。
      </p>

      <p class="mb-4">
        在變更生效前，我們將透過電子郵件和/或我們服務上的顯著通知，告知您，並更新本隱私權政策頂部的「最後更新日期」。
      </p>

      <p class="mb-4">
        建議您定期查看本隱私權政策的任何變更。當本隱私權政策在此頁面上發布時，變更即生效。
      </p>

      <h2 class="text-2xl font-semibold mt-6 mb-4">聯絡我們</h2>

      <p class="mb-2">
        如果您對本隱私權政策有任何疑問，您可以透過以下方式聯絡我們：
      </p>
      <ul class="list-disc pl-5 space-y-2">
        <li>電子郵件：{{ contactEmail }}</li>
      </ul>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
    `,
  ],
})
export class PrivacyPolicyComponent {
  lastUpdated: string = '2024年09月18日';
  companyName: string = 'Novus晶礦人生';
  country: string = '臺灣';
  serviceName: string = '網站';
  websiteName: string = 'Novus晶礦人生';
  websiteUrl: string = 'https://lifepasscode.web.app';
  contactEmail: string = '131419snm@gmail.com';
}
