import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ViewChild,
  computed,
  effect,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { RecordsDialogComponent } from 'src/app/components/records-dialog/records-dialog.component';
import { Account } from 'src/app/models/account';
import { TotalNotify } from 'src/app/models/notify';
import { AccountService } from 'src/app/services/account/account.service';
import { NotifyService } from 'src/app/services/notify/notify.service';

@Component({
  selector: 'app-dashboard-user-list',
  templateUrl: './dashboard-user-list.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    DatePipe,
    MatIconModule,
    RecordsDialogComponent,
    MatSortHeader,
    MatSort,
    MatPaginatorModule,
  ],
  styles: `
    table {
      border-collapse: unset;
      width: 100vw;
    }

    .mat-table-container {
      width: 100%;
      max-width: calc(100vw - 300px);
      max-height: calc(100vh - 150px);
      overflow: auto;
    }

    .mat-mdc-table-sticky-border-elem-right {
      border-left: 1px solid #e0e0e0;
    }

    .mat-mdc-table-sticky-border-elem-left {
      border-right: 1px solid #e0e0e0;
    }

    td.mat-column-allNotify {
      padding-right: 8px;
    }

    th.mat-column-email,
    td.mat-column-email {
      padding-left: 8px;
    }

    .mat-column-actions {
      width: 200px;
    }
  `,
})
export class DashboardUserListComponent implements AfterViewInit {
  private users = signal<Account[]>([]);
  private allNotify = signal<Record<string, TotalNotify>>({});

  userDataSource = new MatTableDataSource<Account>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  processedUserData = computed(() => {
    return this.users().map((user) => {
      const notifyData = this.allNotify()[user.uid!];
      if (user.uid && notifyData) {
        const notify = this.notifyService.patchNotify(notifyData);

        const cartNotify = notify.cartNotify.customer.count;
        const requestNotify = notify.requestNotify.customer.count;

        return {
          ...user,
          cartNotify,
          requestNotify,
          allNotify: cartNotify + requestNotify,
        };
      }
      return { ...user, cartNotify: 0, requestNotify: 0, allNotify: 0 };
    });
  });

  readonly displayedColumns: string[] = [
    'name',
    'verified',
    'email',
    'phone',
    'cartNotify',
    'requestNotify',
    'allNotify',
    'actions',
  ];

  constructor(
    private readonly accountService: AccountService,
    private readonly router: Router,
    private readonly notifyService: NotifyService,
    private readonly dialog: MatDialog,
  ) {
    this.notifyService.allNotify$
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        this.allNotify.set(data);
      });

    effect(() => {
      this.userDataSource.data = this.processedUserData();
    });

    this.loadData();
  }

  private loadData() {
    this.accountService.loadAllUsersAccount().subscribe((users) => {
      this.users.set(users);
    });
  }

  ngAfterViewInit() {
    this.userDataSource.paginator = this.paginator;
    this.userDataSource.sort = this.sort;

    this.userDataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'verified':
          return item.isActivated ? 1 : 0;
        default:
          return (item as any)[property];
      }
    };

    this.sort.sortChange.subscribe(() => {
      if (this.userDataSource.paginator) {
        this.userDataSource.paginator.firstPage();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userDataSource.filter = filterValue.trim().toLowerCase();

    if (this.userDataSource.paginator) {
      this.userDataSource.paginator.firstPage();
    }
  }

  onNavigateToDetail(id: string) {
    this.router.navigate(['dashboard', 'detail', id]);
  }

  onOpenRecordsDialog(id: string) {
    this.dialog.open(RecordsDialogComponent, {
      data: { userId: id },
      width: '70vw',
      height: '80vh',
    });
  }
}
