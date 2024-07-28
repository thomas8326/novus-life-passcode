import { Component, Inject, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { isNil } from 'src/app/common/utilities';
import { RemittanceState, RequestRecord } from 'src/app/models/account';
import { CartRecord } from 'src/app/models/cart';
import { CalculationRequestService } from 'src/app/services/reqeusts/calculation-request.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';

interface DialogData {
  userId: string;
}

@Component({
  selector: 'app-records-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="min-w-[300px] py-4 h-full">
      <h2 mat-dialog-title class="!text-desktopTitle">訂單</h2>
      <mat-dialog-content class="flex-1 h-full my-8">
        <div class="text-gray-800 px-2">
          <div class="flex items-center w-full justify-center px-2 my-6">
            <input
              matInput
              (keyup)="applyFilter($event)"
              placeholder="輸入訂單編號"
              class="border border-gray-400 border-r-0 h-10 px-2 w-7/12"
            />
            <button
              class="h-10 border border-gray-400 px-2 flex items-center justify-center"
            >
              <mat-icon class="">search</mat-icon>
            </button>
          </div>
          <div class="flex flex-col items-center">
            <h3 class="font-bold text-desktopSubTitle">購買記錄</h3>
            <div class="flex flex-col gap-2 mx-3 my-4">
              @for (record of cartRecords(); track record.recordId) {
                <div class="border p-2 w-11/12">
                  <div>{{ record.recordId }}</div>

                  @for (item of record.cartItems; track item.crystal.id) {
                    <div>{{ item.crystal.name }}</div>
                  }
                  <div>
                    {{
                      hasPaid(record.remittanceStates, record.prices.itemsPrice)
                        ? '已全數匯款'
                        : '尚未匯款'
                    }}
                  </div>
                </div>
              } @empty {
                無訂單編號
              }
            </div>

            <h3 class="font-bold text-desktopSubTitle">推算記錄</h3>
            <div class="flex flex-col gap-2 mx-3 my-4">
              @for (record of calculationRequests(); track record.id) {
                <div class="border p-2 w-11/12">
                  <div>{{ record.id }}</div>
                  <div>
                    {{
                      hasPaid(record.remittanceStates, record.prices.totalPrice)
                        ? '已全數匯款'
                        : '尚未匯款'
                    }}
                  </div>
                </div>
              } @empty {
                無訂單編號
              }
            </div>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions [align]="'end'">
        <button mat-button [mat-dialog-close]="false">取消</button>
        <button mat-button class="bg-blue-400" [mat-dialog-close]="true">
          確認
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: ``,
})
export class RecordsDialogComponent {
  title: string = '';
  message: string = '';

  search = signal<string>('');

  cartRecords = computed(() => {
    if (this.search() === '') {
      return this._cartRecords();
    }

    return this._cartRecords().filter((record) =>
      record.recordId.toLowerCase().includes(this.search()),
    );
  });

  calculationRequests = computed(() => {
    if (this.search() === '') {
      return this._calculationRequests();
    }

    return this._calculationRequests().filter((record) =>
      record.id.toLowerCase().includes(this.search()),
    );
  });

  private _cartRecords = signal<CartRecord[]>([]);
  private _calculationRequests = signal<RequestRecord[]>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly calculationRequestService: CalculationRequestService,
  ) {
    this.shoppingCartService
      .getCartRecords(data.userId)
      .subscribe((cartRecords) => {
        this._cartRecords.set(cartRecords);
      });
    this.calculationRequestService
      .getCalculationRequests(data.userId)
      .subscribe((calculationRequests) => {
        this._calculationRequests.set(calculationRequests);
      });
  }

  hasPaid(remittanceStates: RemittanceState[], total: number) {
    if (isNil(remittanceStates)) {
      return false;
    }

    const sum = remittanceStates.reduce((acc, cur) => acc + cur.paid, 0);
    return sum >= total;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.search.set(filterValue.trim().toLowerCase());
  }
}
