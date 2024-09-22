import { Injectable, computed, inject, signal } from '@angular/core';
import { User, UserCredential } from '@angular/fire/auth';
import {
  Firestore,
  arrayUnion,
  collection,
  collectionData,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { limit } from 'firebase/firestore';
import { map } from 'rxjs';
import { isNil } from 'src/app/common/utilities';
import {
  Account,
  AdminAccount,
  BasicInfo,
  Remittance,
} from 'src/app/models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly firestore = inject(Firestore);
  private readonly functions = inject(Functions);

  myAccount = signal<Account | null>(null);
  isAdmin = computed(() => this.myAccount()?.isAdmin || false);
  isSuperAdmin = computed(
    () => (this.myAccount() as AdminAccount)?.isSuperAdmin || false,
  );
  getMyAccount() {
    return this.myAccount();
  }

  fetchMyAccount(currentUser: User | null) {
    if (isNil(currentUser)) {
      throw new Error('Create user failed');
    }

    return getDoc(doc(this.firestore, 'users', currentUser.uid))
      .then((doc) => ({ ...doc.data(), uid: currentUser.uid }) as Account)
      .then((account) => {
        let _account = {
          ...account,
          isActivated: currentUser.emailVerified,
        } as Account;

        if (currentUser.emailVerified && !account.isActivated) {
          this.updateUserAccount(currentUser.uid, { isActivated: true });
          _account = { ..._account, isActivated: true };
        }

        this.myAccount.set(_account);
        return _account;
      });
  }

  reloadMyAccount() {
    const userId = this.getMyAccount()?.uid;

    if (isNil(userId)) {
      return;
    }

    const userDoc = doc(this.firestore, `users/${userId}`);
    return getDoc(userDoc).then((docSnap) => {
      if (!docSnap.exists()) {
        console.error('Document does not exist!');
        return;
      }

      const currentData = docSnap.data() as Account;
      this.myAccount.set(currentData);
    });
  }

  updateRemittances(remittance: Remittance, index: number) {
    const userId = this.getMyAccount()?.uid;

    if (isNil(userId)) {
      return;
    }

    const userDoc = doc(this.firestore, `users/${userId}`);

    return getDoc(userDoc)
      .then((docSnap) => {
        if (!docSnap.exists()) {
          console.error('Document does not exist!');
          return;
        }

        const currentData = docSnap.data() as Account;
        let remittances = currentData.remittances || [];

        if (isNil(index)) {
          remittances.push(remittance);
        } else {
          remittances[index] = remittance;
        }

        return updateDoc(userDoc, {
          remittances,
        });
      })
      .then(() => this.reloadMyAccount());
  }

  updateBasicInfos(basicInfos: BasicInfo[]) {
    const userId = this.getMyAccount()?.uid;

    if (isNil(userId)) {
      return;
    }

    const userDoc = doc(this.firestore, `users/${userId}`);

    return getDoc(userDoc)
      .then((docSnap) => {
        if (!docSnap.exists()) {
          console.error('Document does not exist!');
          return;
        }

        return updateDoc(userDoc, {
          basicInfos,
        });
      })
      .then(() => this.reloadMyAccount());
  }

  updateUserAccount(uid: string, account: Partial<Account>) {
    return updateDoc(doc(this.firestore, 'users', uid), account).then(() =>
      this.reloadMyAccount(),
    );
  }

  setUserAccount(uid: string, account: Account) {
    return setDoc(doc(this.firestore, 'users', uid), account);
  }

  loadAllUsersAccount() {
    const usersRef = collection(this.firestore, 'users');
    const q = query(
      usersRef,
      where('isAdmin', '==', false),
      orderBy('isActivated', 'desc'),
    );

    return collectionData(q, { idField: 'uid' }).pipe(
      map((users) => users as Account[]),
    );
  }

  loadPaginationUsersAccount(page: number) {
    const ref = collection(this.firestore, `users`);
    const q = query(ref, orderBy('name'), startAfter(page), limit(1));

    return Promise.all([getCountFromServer(ref), getDocs(q)]).then(
      ([count, docs]) => {
        return {
          count: count.data().count,
          docs: docs.docs.map((d) => ({ uid: d.id, ...d.data() })) as Account[],
        };
      },
    );
  }

  addRecordId(field: 'calculationRequests' | 'cartRecords', id: string) {
    const userId = this.getMyAccount()?.uid;

    if (isNil(userId)) {
      console.error('Current user is not found');
      return;
    }

    const updated = {
      [field]: arrayUnion(id),
    };

    return updateDoc(doc(this.firestore, `users/${userId}`), updated).then(
      () => ({ id }),
    );
  }

  createAdminAccount(alias: string, email: string, password: string) {
    const createAdmin = httpsCallable<
      { alias: string; email: string; password: string },
      UserCredential
    >(this.functions, 'createAdminUser');

    return createAdmin({ alias, email, password });
  }

  enabledAdminAccount(uid: string, enabled: boolean) {
    updateDoc(doc(this.firestore, 'users', uid), {
      enabled,
    });
  }

  loadAdminAccounts() {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('isAdmin', '==', true));

    return collectionData(q, {
      idField: 'uid',
    }).pipe(map((users) => users as AdminAccount[]));
  }
}
