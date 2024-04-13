import { Injectable, inject } from '@angular/core';
import {
  Database,
  onValue,
  push,
  ref,
  remove,
  update,
} from '@angular/fire/database';

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserFormService {
  private readonly database: Database = inject(Database);
  private readonly PATH = `form`;
  private readonly subscriptions: Function[] = [];

  constructor() {}

  listenCleanFlow(callback: (data: string) => void) {
    const path = `${this.PATH}/clean-flow`;
    const dbRef = ref(this.database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val() as { flow: string };
        callback(val.flow);
      },
      (error) => {
        console.error(error);
      },
    );
    this.subscriptions.push(unsubscribe);
  }

  updateCleanFlow(flow: string) {
    const updateRef = ref(this.database, `${this.PATH}/clean-flow`);
    update(updateRef, { flow });
  }

  listenFAQs(callback: (data: Record<string, FAQ>) => void) {
    const path = `${this.PATH}/faq`;
    const dbRef = ref(this.database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => callback(snapshot.val() as Record<string, FAQ>),
      (error) => {
        console.error(error);
      },
    );
    this.subscriptions.push(unsubscribe);
  }

  addFaq(question: string, answer: string) {
    const path = `${this.PATH}/faq`;
    const dbRef = ref(this.database, path);
    if (answer === '' || question === '') return;

    push(dbRef, { question, answer });
  }

  removeFaq(id: string) {
    const path = `${this.PATH}/${id}`;
    const removeRef = ref(this.database, path);
    remove(removeRef);
  }

  updateFaq(faq: FAQ) {
    const path = `${this.PATH}/${faq.id}`;
    const updateRef = ref(this.database, path);

    update(updateRef, { question: faq.question, answer: faq.answer });
  }

  unsubscribe() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
  }
}
