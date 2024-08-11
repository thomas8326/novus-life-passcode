# Novus LifePassport 商業網站

## 專案概述

Novus LifePassport 是一個商業網站專案，旨在提供優質的線上服務和產品展示平台。

## 功能特點

- 響應式設計，適配各種設備
- 用戶友好的介面
- 產品展示和詳細信息
- 線上訂購系統
- 客戶支援功能

## 技術棧

- 前端框架: Angular 18
- 樣式: Tailwind CSS
- 後端服務: Firebase
- 部署: Firebase Hosting

## 開始使用

### 安裝和運行

1. 克隆專案到本地：

   ```
   git clone [專案倉庫URL]
   ```

2. 進入專案目錄：

   ```
   cd novus-lifepasasport
   ```

3. 安裝依賴：

   ```
   npm install
   ```

4. 啟動開發伺服器：

   ```
   npm start
   ```

   這將運行 `ng serve` 命令，啟動 Angular 開發伺服器。

5. 在瀏覽器中訪問 `http://localhost:4200` 查看網站。

### 構建和部署

1. 構建生產版本：

   ```
   npm run build
   ```

   這將執行 `ng build --configuration production --aot` 命令。

2. 部署到 Firebase：
   ```
   npm run deploy
   ```
   這將執行構建並部署到 Firebase Hosting。

注意：確保您已經設置好 Firebase 專案並有適當的部署權限。

### 安裝依賴

在專案根目錄執行以下命令安裝所需依賴：
