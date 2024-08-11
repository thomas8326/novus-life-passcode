# Firebase Functions 使用指南

## 函數開發

1. 函數檔案不需要初始化 Firebase 應用程式（initialApp）。

2. 所有函數應該在 `index.ts` 中導出，這些導出的函數將成為 API 端點。

   例如：

   ```typescript
   export { setUserStatus } from "./userState";
   ```

3. 本地開發和測試：

   - 使用 `npm run serve` 啟動 Firebase 模擬器
   - 同時在前端專案目錄中運行 `ng serve` 啟動 Angular 開發伺服器

4. 部署：

   - 完成開發和測試後，使用 `npm run deploy` 部署函數到 Firebase

5. 本地部署和測試：

   - 函數將部署在 `http://127.0.0.1:5001`
   - 函數的 UI 介面可在 `http://127.0.0.1:4000/functions` 查看
   - 在本地端呼叫 API 時，請使用以下格式的 URL：
     `http://127.0.0.1:5001/lifepasscode-671d3/us-central1/你的函數名稱`

   例如，如果你有一個名為 `setUserStatus` 的函數，本地測試時的 URL 應該是：
   `http://127.0.0.1:5001/lifepasscode-671d3/us-central1/setUserStatus`

6. 成功部署後：
   - 使用 `https://us-central1-lifepasscode-671d3.cloudfunctions.net/你的函數名稱` 來呼叫函數

## 注意事項

- 確保所有函數都經過充分測試
- 檢查函數的權限設置，確保安全性
- 定期檢查和更新依賴項

## 常見問題解決

如果遇到部署或執行問題：

1. 檢查 `package.json` 中的依賴項是否最新
2. 確保本地 Firebase CLI 版本與專案相容
3. 檢查 Firebase 專案設置是否正確

記住，良好的錯誤處理和日誌記錄可以大大提高問題診斷和解決的效率。
