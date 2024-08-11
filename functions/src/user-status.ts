import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

interface CreateAdminUserData {
  alias: string;
  email: string;
  password: string;
}

export const createAdminUser = functions.https.onCall(
  async (data: CreateAdminUserData, context) => {
    // 確保調用者已經通過身份驗證
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.',
      );
    }

    // 檢查調用者是否有超級管理員權限
    const callerUid = context.auth.uid;
    const callerRef = admin.firestore().collection('users').doc(callerUid);
    const callerDoc = await callerRef.get();

    if (!callerDoc.exists || !callerDoc.data()?.isSuperAdmin) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Must be a super admin to create an admin user.',
      );
    }

    const { alias, email, password } = data;

    try {
      // 創建新用戶
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
      });

      // 設置自定義聲明
      await admin.auth().setCustomUserClaims(userRecord.uid, { isAdmin: true });

      // 更新 Firestore 中的用戶文檔
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        name: alias,
        email,
        isAdmin: true,
        enabled: true,
        isActivated: true,
      });

      return {
        result: `Admin user ${email} created successfully with ID: ${userRecord.uid}`,
        userId: userRecord.uid,
      };
    } catch (error) {
      console.error('Error creating admin user:', error);
      if (error instanceof Error) {
        const errorCode = (error as any).code || 'unknown-error';
        const errorMessage = error.message || '未知錯誤';
        throw new functions.https.HttpsError(errorCode, errorMessage);
      } else {
        throw new functions.https.HttpsError(
          'internal',
          '建立使用者時發生內部錯誤',
        );
      }
    }
  },
);
