import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ExpandingButtonComponent } from 'src/app/components/expanding-button/expanding-button.component';
import { Member } from 'src/app/models/member';
import { ImportExcelService } from 'src/app/services/file/import-excel.service';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
    MatExpansionModule,
    ExpandingButtonComponent,
    RouterLink,
  ],
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
      this.memberService.postMember(data);
    });
    this.inputFile.nativeElement.value = '';
  }
}
