import axios from 'axios';
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

const corsHandler = cors({ origin: true });

interface StoreRequest {
  storeid: number;
  storename: string;
  storeaddress: string;
  outside: number;
  ship: number;
  TempVar: any;
}

interface DeliveryAddress {
  address: string;
  zipCode: string;
  storeName: string;
  storeId: number;
  temp: boolean;
}

export const get7ElevenStores = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
      res.status(401).send('Unauthorized');
      return;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const params = req.body as StoreRequest;
      const apiUrl = `/7eleven_stores`;
      const response = await axios.post(apiUrl, params);

      const request: DeliveryAddress = {
        address: params.storeaddress,
        zipCode: '',
        storeName: params.storename,
        storeId: params.storeid,
        temp: true,
      }

      await admin.firestore().collection(`/users/${userId}/deliveryAddress`).add(request);
      res.status(200).json(response.data);

    } catch (error) {
      console.error('Error fetching 7-Eleven stores:', error);
      res.status(500).send('Error fetching stores');
    }
  });
});
