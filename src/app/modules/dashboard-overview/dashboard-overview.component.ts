import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { Member } from 'src/app/models/member';
import { ImportExcelService } from 'src/app/services/file/import-excel.service';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [RouterOutlet, MatIconModule],
  templateUrl: './dashboard-overview.component.html',
  styles: ``,
})
export class DashboardOverviewComponent {
  @ViewChild('inputFile') inputFile!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly importExcelService: ImportExcelService,
    private memberService: MemberService,
  ) {}

  onImportExcel(files: FileList | null) {
    this.importExcelService.importExcel(files).then((data: Member[]) => {
      console.log(data);
      this.memberService.postMember(data);
    });
    this.inputFile.nativeElement.value = '';
  }
}
