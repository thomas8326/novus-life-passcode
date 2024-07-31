import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const corsHandler = cors({ origin: true });

interface Store {
  TempVar: string;
  outside: string;
  ship: string;
  storeaddress: string;
  storeid: string;
  storename: string;
  expiresAt: number;
}

interface TempData {
  data: Store;
  expiresAt: number;
}

export const storeCallback = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== 'POST') {
      return response.status(405).send('Method Not Allowed');
    }

    const dataFromB: Store = request.body;
    const sessionId = dataFromB.TempVar; // TempVar is sessionId from FE.
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    try {
      await admin
        .database()
        .ref(`tempData/${sessionId}`)
        .set({
          data: dataFromB,
          expiresAt: expirationTime,
        } as TempData);

      // Set up a cloud function to delete this data after it expires
      await admin
        .database()
        .ref(`tempData/${sessionId}`)
        .onDisconnect()
        .remove();

      return response.json({
        message: '資料已成功儲存，請關閉此視窗返回主頁面。',
      });
    } catch (error) {
      console.error('Error saving data:', error);
      return response.status(500).send('Error saving data');
    }
  });
});

// Clean up expired data periodically
export const cleanupExpiredData = functions.pubsub
  .schedule('every 10 minutes')
  .onRun(async (context) => {
    const now = Date.now();
    const expiredDataRef = admin
      .database()
      .ref('tempData')
      .orderByChild('expiresAt')
      .endAt(now);

    try {
      const snapshot = await expiredDataRef.once('value');
      const updates: { [key: string]: null } = {};
      snapshot.forEach((child) => {
        updates[child.key as string] = null;
      });

      if (Object.keys(updates).length > 0) {
        await admin.database().ref('tempData').update(updates);
      }

      console.log('Cleanup completed');
      return null;
    } catch (error) {
      console.error('Error during cleanup:', error);
      return null;
    }
  });
