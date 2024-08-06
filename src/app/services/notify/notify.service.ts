import { Injectable, inject } from '@angular/core';
import {
  Database,
  onValue,
  ref,
  runTransaction,
  set,
} from '@angular/fire/database';
import { BehaviorSubject, Subject } from 'rxjs';
import { isNil } from 'src/app/common/utilities';
import { TotalNotify } from 'src/app/models/notify';
import { AccountService } from 'src/app/services/account/account.service';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private database: Database = inject(Database);
  private notify = new Subject<TotalNotify>();
  private allNotify = new BehaviorSubject<Record<string, TotalNotify>>({});

  allNotify$ = this.allNotify.asObservable();
  notify$ = this.notify.asObservable();

  constructor(private readonly account: AccountService) {}

  listenAllNotify() {
    const path = 'notify';
    const _ref = ref(this.database, path);

    const listener = () =>
      onValue(
        _ref,
        (snapshot) => {
          const data = snapshot.val() as Record<string, TotalNotify>;
          this.allNotify.next(data);
        },
        (error) => {
          console.error(error);
        },
      );

    return {
      subscribe: listener,
      unsubscribe: () => {
        const unsubscribe = listener();
        unsubscribe();
      },
    };
  }

  listenNotify(userId?: string) {
    if (isNil(userId)) {
      throw new Error('Not found userId');
    }

    const path = `notify/${userId}`;
    const _ref = ref(this.database, path);

    const listener = () =>
      onValue(
        _ref,
        (snapshot) => {
          const data = snapshot.val() as TotalNotify;
          this.notify.next(data);
        },
        (error) => {
          console.error(error);
        },
      );

    return {
      subscribe: listener,
      unsubscribe: () => {
        const unsubscribe = listener();
        unsubscribe();
      },
    };
  }

  updateNotify(
    type: 'request' | 'cart',
    from: 'customer' | 'system',
    userId?: string,
  ) {
    const _userId = userId || this.account.getMyAccount()?.uid;
    const _type = type === 'cart' ? 'cartNotify' : 'requestNotify';
    const path = `notify/${_userId}/${_type}/${from}`;
    const countRef = ref(this.database, path);

    runTransaction(countRef, (transaction) => {
      const data = transaction;

      if (data) {
        return { count: data.count + 1, read: false };
      } else {
        return { count: 1, read: false };
      }
    });
  }

  readNotify(
    type: 'request' | 'cart',
    from: 'customer' | 'system',
    userId?: string,
  ) {
    const _userId = userId || this.account.getMyAccount()?.uid;
    const _type = type === 'cart' ? 'cartNotify' : 'requestNotify';
    // 要將對方的通知設為已讀，所以這邊會相反
    const _from = from === 'customer' ? 'system' : 'customer';

    const path = `notify/${_userId}/${_type}/${_from}`;
    const countRef = ref(this.database, path);
    set(countRef, { count: 0, read: true });
  }

  getNotify(totalNotify: TotalNotify, from: 'customer' | 'system') {
    if (from === 'customer') {
      return (
        !totalNotify.cartNotify.system.read ||
        !totalNotify.requestNotify.system.read
      );
    } else {
      return (
        !totalNotify.cartNotify.customer.read ||
        !totalNotify.requestNotify.customer.read
      );
    }
  }
}
