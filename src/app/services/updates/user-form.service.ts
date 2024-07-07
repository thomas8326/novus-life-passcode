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
  category: string;
}

export interface CleanFlow {
  flow: string;
  tutorial: { link: string; title: string };
}

@Injectable({
  providedIn: 'root',
})
export class UserFormService {
  private readonly database: Database = inject(Database);
  private readonly PATH = `form`;
  private readonly subscriptions: Function[] = [];

  constructor() {}

  listenCleanFlow(callback: (data: CleanFlow) => void) {
    const path = `updates/${this.PATH}/clean-flow`;
    const dbRef = ref(this.database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val() as CleanFlow;
        callback(val);
      },
      (error) => {
        console.error(error);
      },
    );
    this.subscriptions.push(unsubscribe);
  }

  updateCleanFlow(flow: string) {
    const updateRef = ref(this.database, `updates/${this.PATH}/clean-flow`);
    update(updateRef, { flow });
  }

  updateCleanFlowTutorial(tutorial: { link: string; title: string }) {
    const updateRef = ref(this.database, `updates/${this.PATH}/clean-flow`);
    update(updateRef, { tutorial });
  }

  listenFAQs(callback: (data: Record<string, FAQ>) => void) {
    const path = `updates/${this.PATH}/faq`;
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

  addFaq(question: string, answer: string, category: string) {
    const path = `updates/${this.PATH}/faq`;
    const dbRef = ref(this.database, path);
    if (answer === '' || question === '') return;

    push(dbRef, { question, answer, category });
  }

  removeFaq(id: string) {
    const path = `updates/${this.PATH}/faq/${id}`;
    const removeRef = ref(this.database, path);
    remove(removeRef);
  }

  updateFaq(faq: FAQ) {
    const path = `updates/${this.PATH}/faq/${faq.id}`;
    const updateRef = ref(this.database, path);
    const { id, ...props } = faq;

    update(updateRef, props);
  }

  listenIntroduction(callback: (data: string) => void) {
    const path = `updates/${this.PATH}/introduction`;
    const dbRef = ref(this.database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val() as { introduction: string };
        callback(val.introduction);
      },
      (error) => {
        console.error(error);
      },
    );
    this.subscriptions.push(unsubscribe);
  }

  updateIntroduction(introduction: string) {
    const updateRef = ref(this.database, `updates/${this.PATH}/introduction`);
    update(updateRef, { introduction });
  }

  unsubscribe() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
  }
}
