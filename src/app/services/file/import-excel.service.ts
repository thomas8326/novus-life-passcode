import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { ExcelColumn } from 'src/app/enums/excel-column';
import { v4 } from 'uuid';
import { WorkBook, WorkSheet, read, utils } from 'xlsx';
import { Member } from '../../models/member';

const EXCEL_FILE = /(.xls|.xlsx)/;

@Injectable({
  providedIn: 'root',
})
export class ImportExcelService {
  constructor() {}

  importExcel(files: FileList | null): Promise<Member[]> {
    return new Promise((resolve, reject) => {
      if (!files || files?.length === 0) {
        return reject('檔案為空');
      }

      let data: object[];
      const isExcelFile = !!files[0].name.match(EXCEL_FILE);

      if (!isExcelFile) {
        return reject('請匯入Excel檔案');
      }
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const workbook: WorkBook = read(bstr, { type: 'binary' });

        /* grab first sheet */
        const firstSheetName: string = workbook.SheetNames[0];
        const sheet: WorkSheet = workbook.Sheets[firstSheetName];

        data = utils.sheet_to_json(sheet);
      };

      reader.readAsBinaryString(files[0]);

      reader.onloadend = () => {
        const members: Member[] = [];
        for (let member of data) {
          members.push(this.excelKeyConverter(member));
        }
        resolve(members);
      };
    });
  }

  private excelKeyConverter(data: object) {
    const user: Member = { id: v4(), name: '', birthday: '' };

    for (let [key, value] of Object.entries(data)) {
      switch (key) {
        case ExcelColumn.Name:
          user.name = value;
          break;
        case ExcelColumn.Birthday:
          user.birthday = this.excelDateToTime(value);
          break;
        default: {
          new Error('出現非預期的欄位: ' + key);
        }
      }
    }
    return user;
  }

  private excelDateToTime(serial: number): string {
    // Excel的日期序列号是从1900年1月0日开始的
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400; // 将天数转换为秒数
    const date_info = new Date(utc_value * 1000); // JavaScript的Date对象是基于毫秒的

    // 由于UTC和本地时间可能有差异，这里调整时区
    const offset = date_info.getTimezoneOffset() * 60000;

    const localDate = date_info.getTime() + offset;

    return dayjs(localDate).format('YYYY/MM/DD');
  }
}
