import { Injectable } from '@angular/core';

export interface Bank {
  code: string;
  name: string;
}

export interface UserBank extends Bank {
  account: string;
}

@Injectable({
  providedIn: 'root',
})
export class BankService {
  fetchBankData(): Bank[] {
    return [
      { code: '004', name: '臺灣銀行' },
      { code: '005', name: '土地銀行' },
      { code: '006', name: '合庫商銀' },
      { code: '007', name: '第一銀行' },
      { code: '008', name: '華南銀行' },
      { code: '009', name: '彰化銀行' },
      { code: '011', name: '上海銀行' },
      { code: '012', name: '台北富邦' },
      { code: '013', name: '國泰世華' },
      { code: '016', name: '高雄銀行' },
      { code: '017', name: '兆豐銀行' },
      { code: '018', name: '農業金庫' },
      { code: '020', name: '瑞穗銀行' },
      { code: '021', name: '花旗(台灣)銀行' },
      { code: '022', name: '美國銀行' },
      { code: '023', name: '盤谷銀行' },
      { code: '025', name: '首都銀行' },
      { code: '048', name: '王道銀行' },
      { code: '050', name: '臺灣企銀' },
      { code: '052', name: '渣打商銀' },
      { code: '053', name: '台中銀行' },
      { code: '054', name: '京城商銀' },
      { code: '072', name: '德意志銀行' },
      { code: '075', name: '東亞銀行' },
      { code: '081', name: '匯豐(台灣)銀行' },
      { code: '082', name: '巴黎銀行' },
      { code: '101', name: '瑞興銀行' },
      { code: '102', name: '華泰銀行' },
      { code: '103', name: '臺灣新光商銀' },
      { code: '104', name: '台北五信' },
      { code: '108', name: '陽信銀行' },
      { code: '114', name: '基隆一信' },
      { code: '115', name: '基隆二信' },
      { code: '118', name: '板信銀行' },
      { code: '119', name: '淡水一信' },
      { code: '120', name: '淡水信合社' },
      { code: '124', name: '宜蘭信合社' },
      { code: '127', name: '桃園信合社' },
      { code: '130', name: '新竹一信' },
      { code: '132', name: '新竹三信' },
      { code: '146', name: '台中二信' },
      { code: '147', name: '三信銀行' },
      { code: '158', name: '彰化一信' },
      { code: '161', name: '彰化五信' },
      { code: '162', name: '彰化六信' },
      { code: '163', name: '彰化十信' },
      { code: '165', name: '鹿港信合社' },
      { code: '178', name: '嘉義三信' },
      { code: '188', name: '台南三信' },
      { code: '204', name: '高雄三信' },
      { code: '215', name: '花蓮一信' },
      { code: '216', name: '花蓮二信' },
      { code: '222', name: '澎湖一信' },
      { code: '223', name: '澎湖二信' },
      { code: '224', name: '金門信合社' },
      { code: '329', name: '印尼人民銀行' },
      { code: '330', name: '韓亞銀行' },
      { code: '388', name: '全盈支付' },
      { code: '389', name: '全支付' },
      { code: '390', name: '悠遊付' },
      { code: '391', name: '一卡通' },
      { code: '392', name: '愛金卡' },
      { code: '395', name: '橘子支付' },
      { code: '396', name: '街口支付' },
      { code: '397', name: '歐付寶' },
      { code: '398', name: '簡單付' },
      { code: '501', name: '蘇澳漁會' },
      { code: '502', name: '頭城漁會' },
      { code: '506', name: '桃園漁會' },
      { code: '507', name: '新竹漁會' },
      { code: '508', name: '通苑漁會' },
      { code: '510', name: '南龍漁會' },
      { code: '511', name: '彰化漁會' },
      { code: '512', name: '雲林區漁會' },
      { code: '513', name: '瑞芳漁會' },
      { code: '514', name: '萬里漁會' },
      { code: '515', name: '嘉義區漁會' },
      { code: '516', name: '基隆漁會' },
      { code: '517', name: '南市區漁會' },
      { code: '518', name: '南縣區漁會' },
      { code: '519', name: '新化農會' },
      { code: '520', name: '高雄區漁會、小港區漁會' },
      { code: '521', name: '興達港、彌陀、永安、林園、梓官區等漁會' },
      { code: '523', name: '琉球、東港、林邊、枋寮區等漁會' },
      { code: '524', name: '新港區漁會' },
      { code: '525', name: '澎湖區漁會' },
      { code: '526', name: '金門區漁會' },
      { code: '538', name: '宜蘭農會' },
      { code: '541', name: '白河農會' },
      { code: '542', name: '麻豆農會' },
      { code: '547', name: '後壁農會' },
      { code: '549', name: '下營農會' },
      { code: '551', name: '官田農會' },
      { code: '552', name: '大內農會' },
      { code: '556', name: '學甲農會' },
      { code: '557', name: '新市農會' },
      { code: '558', name: '安定農會' },
      { code: '559', name: '山上農會' },
      { code: '561', name: '左鎮農會' },
      { code: '562', name: '仁德農會' },
      { code: '564', name: '關廟農會' },
      { code: '565', name: '龍崎農會' },
      { code: '567', name: '南化農會' },
      { code: '568', name: '七股農會' },
      { code: '570', name: '南投農會' },
      { code: '573', name: '埔里農會' },
      { code: '574', name: '竹山農會' },
      { code: '575', name: '中寮農會' },
      { code: '577', name: '魚池農會' },
      { code: '578', name: '水里農會' },
      { code: '579', name: '國姓農會' },
      { code: '580', name: '鹿谷農會' },
      { code: '581', name: '信義農會' },
      { code: '582', name: '仁愛農會' },
      { code: '583', name: '東山農會' },
      { code: '585', name: '頭城農會' },
      { code: '586', name: '羅東農會' },
      { code: '587', name: '礁溪農會' },
      { code: '588', name: '壯圍農會' },
      { code: '589', name: '員山農會' },
      { code: '596', name: '五結農會' },
      { code: '598', name: '蘇澳農會' },
      { code: '599', name: '三星農會' },
      { code: '600', name: '農金資訊' },
      { code: '602', name: '中華民國農會' },
      { code: '605', name: '高雄農會' },
      { code: '612', name: '台中市豐原區農會、神岡區農會' },
      { code: '613', name: '南投縣名間鄉農會、集集鎮農會' },
      { code: '614', name: '彰化縣等農會' },
      { code: '615', name: '基隆農會' },
      { code: '616', name: '雲林縣等農會' },
      { code: '617', name: '嘉義縣市等農會' },
      { code: '618', name: '台南市等農會' },
      { code: '619', name: '高雄市等農會' },
      { code: '620', name: '屏東縣市等農會' },
      { code: '621', name: '花蓮縣新秀、富里、吉安、壽豐等農會' },
      { code: '622', name: '台東縣等農會' },
      { code: '624', name: '澎湖縣農會' },
      { code: '625', name: '臺中農會' },
      { code: '627', name: '連江縣農會' },
      { code: '628', name: '鹿港農會' },
      { code: '629', name: '和美農會' },
      { code: '631', name: '溪湖農會' },
      { code: '632', name: '田中農會' },
      { code: '633', name: '北斗農會' },
      { code: '635', name: '線西農會' },
      { code: '636', name: '伸港農會' },
      { code: '638', name: '花壇農會' },
      { code: '639', name: '大村農會' },
      { code: '642', name: '社頭農會' },
      { code: '643', name: '二水農會' },
      { code: '646', name: '大城農會' },
      { code: '647', name: '溪州農會' },
      { code: '649', name: '埔鹽農會' },
      { code: '650', name: '福興農會' },
      { code: '651', name: '彰化農會' },
      { code: '683', name: '北港農會' },
      { code: '685', name: '土庫農會' },
      { code: '693', name: '東勢鄉農會' },
      { code: '696', name: '水林農會' },
      { code: '697', name: '元長農會' },
      { code: '698', name: '麥寮農會' },
      { code: '699', name: '林內農會' },
      { code: '700', name: '中華郵政' },
      { code: '749', name: '內埔農會' },
      { code: '762', name: '大溪農會' },
      { code: '763', name: '桃園農會' },
      { code: '764', name: '平鎮農會' },
      { code: '765', name: '楊梅農會' },
      { code: '766', name: '大園農會' },
      { code: '767', name: '蘆竹農會' },
      { code: '768', name: '龜山農會' },
      { code: '769', name: '八德農會' },
      { code: '770', name: '新屋農會' },
      { code: '771', name: '龍潭農會' },
      { code: '772', name: '復興農會' },
      { code: '773', name: '觀音農會' },
      { code: '775', name: '土城農會' },
      { code: '776', name: '三重農會' },
      { code: '777', name: '中和農會' },
      { code: '778', name: '淡水農會' },
      { code: '779', name: '樹林農會' },
      { code: '780', name: '鶯歌農會' },
      { code: '781', name: '三峽農會' },
      { code: '785', name: '蘆洲農會' },
      { code: '786', name: '五股農會' },
      { code: '787', name: '林口農會' },
      { code: '788', name: '泰山農會' },
      { code: '789', name: '坪林農會' },
      { code: '790', name: '八里農會' },
      { code: '791', name: '金山農會' },
      { code: '792', name: '瑞芳農會' },
      { code: '793', name: '新店農會' },
      { code: '795', name: '深坑農會' },
      { code: '796', name: '石碇農會' },
      { code: '797', name: '平溪農會' },
      { code: '798', name: '石門農會' },
      { code: '799', name: '三芝農會' },
      { code: '803', name: '聯邦銀行' },
      { code: '805', name: '遠東銀行' },
      { code: '806', name: '元大銀行' },
      { code: '807', name: '永豐銀行' },
      { code: '808', name: '玉山銀行' },
      { code: '809', name: '凱基銀行' },
      { code: '810', name: '星展(台灣)銀行' },
      { code: '812', name: '台新銀行' },
      { code: '816', name: '安泰銀行' },
      { code: '822', name: '中國信託' },
      { code: '823', name: '將來銀行' },
      { code: '824', name: '連線銀行' },
      { code: '826', name: '樂天銀行' },
      { code: '860', name: '中埔農會' },
      { code: '866', name: '阿里山農會' },
      { code: '868', name: '東勢區農會' },
      { code: '869', name: '清水農會' },
      { code: '870', name: '梧棲農會' },
      { code: '871', name: '大甲農會' },
      { code: '872', name: '沙鹿農會' },
      { code: '874', name: '霧峰農會' },
      { code: '875', name: '太平農會' },
      { code: '876', name: '烏日農會' },
      { code: '877', name: '后里農會' },
      { code: '878', name: '大雅農會' },
      { code: '879', name: '潭子農會' },
      { code: '880', name: '石岡農會' },
      { code: '881', name: '新社農會' },
      { code: '882', name: '大肚農會' },
      { code: '883', name: '外埔農會' },
      { code: '884', name: '大安農會' },
      { code: '885', name: '龍井農會' },
      { code: '886', name: '和平農會' },
      { code: '891', name: '花蓮農會' },
      { code: '895', name: '瑞穗農會' },
      { code: '896', name: '玉溪農會' },
      { code: '897', name: '鳳榮農會' },
      { code: '898', name: '光豐農會' },
      { code: '901', name: '大里農會' },
      { code: '902', name: '苗栗農會' },
      { code: '903', name: '汐止農會' },
      { code: '904', name: '新莊農會' },
      { code: '906', name: '頭份農會' },
      { code: '907', name: '竹南農會' },
      { code: '908', name: '通霄農會' },
      { code: '909', name: '苑裡農會' },
      { code: '912', name: '冬山農會' },
      { code: '913', name: '後龍農會' },
      { code: '914', name: '卓蘭農會' },
      { code: '915', name: '西湖農會' },
      { code: '916', name: '草屯農會' },
      { code: '917', name: '公館農會' },
      { code: '918', name: '銅鑼農會' },
      { code: '919', name: '三義農會' },
      { code: '920', name: '造橋農會' },
      { code: '921', name: '南庄農會' },
      { code: '922', name: '臺南農會' },
      { code: '923', name: '獅潭農會' },
      { code: '924', name: '頭屋農會' },
      { code: '925', name: '三灣農會' },
      { code: '926', name: '大湖農會' },
      { code: '928', name: '板橋農會' },
      { code: '929', name: '關西農會' },
      { code: '930', name: '新埔農會' },
      { code: '931', name: '竹北農會' },
      { code: '932', name: '湖口農會' },
      { code: '933', name: '芎林農會' },
      { code: '934', name: '寶山農會' },
      { code: '935', name: '峨眉農會' },
      { code: '936', name: '北埔農會' },
      { code: '937', name: '竹東農會' },
      { code: '938', name: '橫山農會' },
      { code: '939', name: '新豐農會' },
      { code: '940', name: '新竹農會' },
      { code: '953', name: '田尾農會' },
      { code: '984', name: '北投農會' },
      { code: '985', name: '士林農會' },
      { code: '986', name: '內湖農會' },
      { code: '987', name: '南港農會' },
      { code: '988', name: '木柵農會' },
      { code: '989', name: '景美農會' },
    ];
  }
}
