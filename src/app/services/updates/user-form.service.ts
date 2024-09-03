import { Injectable, inject } from '@angular/core';
import {
  Database,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from '@angular/fire/database';

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  category: string;
}

export interface Tutorial {
  link: string;
  title: string;
}

export interface BoxIntroduce {
  introduction: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserFormService {
  private readonly database: Database = inject(Database);
  private readonly PATH = `form`;
  private readonly subscriptions: Function[] = [];

  constructor() {}

  listenBoxIntroduce(callback: (data: BoxIntroduce) => void) {
    const path = `updates/${this.PATH}/box-introduce`;
    const dbRef = ref(this.database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val() as BoxIntroduce;
        callback(val);
      },
      (error) => {
        console.error(error);
      },
    );
    this.subscriptions.push(unsubscribe);
  }

  listenTutorial(callback: (data: Tutorial) => void) {
    const path = `updates/${this.PATH}/tutorial`;
    const dbRef = ref(this.database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val() as Tutorial;

        callback(val);
      },
      (error) => {
        console.error(error);
      },
    );
    this.subscriptions.push(unsubscribe);
  }

  listenCleanFlow(callback: (data: string) => void) {
    const path = `updates/${this.PATH}/clean-flow`;
    const dbRef = ref(this.database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val() as string;
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
    set(updateRef, flow);
  }

  updateTutorial(tutorial: { link: string; title: string }) {
    const updateRef = ref(this.database, `updates/${this.PATH}/tutorial`);
    update(updateRef, { tutorial });
  }

  updateBoxIntroduce(boxIntroduce: Partial<BoxIntroduce>) {
    const updateRef = ref(this.database, `updates/${this.PATH}/box-introduce`);
    update(updateRef, boxIntroduce);
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
