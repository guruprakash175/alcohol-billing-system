const admin = require('firebase-admin');
const logger = require('../utils/logger');

let firebaseApp = null;
let firebaseEnabled = false;

/* ============================
   Initialize Firebase Admin
============================ */
const initializeFirebase = () => {
  if (process.env.ENABLE_FIREBASE !== 'true') {
    logger.warn('Firebase Admin initialization skipped (ENABLE_FIREBASE=false)');
    return null;
  }

  try {
    // Already initialized
    if (admin.apps.length > 0) {
      firebaseApp = admin.app();
      firebaseEnabled = true;
      logger.info('Firebase Admin already initialized');
      return firebaseApp;
    }

    // 🔹 Option 1: Service account JSON file
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      logger.info('Firebase Admin initialized using service account file');
    }
    // 🔹 Option 2: Environment variables
    else {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : null;

      if (
        !privateKey ||
        !process.env.FIREBASE_CLIENT_EMAIL ||
        !process.env.FIREBASE_PROJECT_ID
      ) {
        throw new Error('Missing required Firebase Admin SDK environment variables');
      }

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      logger.info('Firebase Admin initialized using environment variables');
    }

    firebaseEnabled = true;
    return firebaseApp;
  } catch (error) {
    firebaseEnabled = false;
    logger.error(`Firebase Admin initialization failed: ${error.message}`);
    throw error;
  }
};

/* ============================
   Helpers (SAFE)
============================ */
const isFirebaseEnabled = () => firebaseEnabled;

const verifyIdToken = async (idToken) => {
  if (!firebaseEnabled) {
    throw new Error('Firebase is disabled');
  }
  return admin.auth().verifyIdToken(idToken);
};

const setUserRole = async (uid, role) => {
  if (!firebaseEnabled) return;
  await admin.auth().setCustomUserClaims(uid, { role });
  logger.info(`Set role '${role}' for user ${uid}`);
};

const getUserByUid = (uid) => admin.auth().getUser(uid);
const getUserByEmail = (email) => admin.auth().getUserByEmail(email);
const getUserByPhoneNumber = (phoneNumber) =>
  admin.auth().getUserByPhoneNumber(phoneNumber);
const deleteUser = (uid) => admin.auth().deleteUser(uid);
const createCustomToken = (uid) => admin.auth().createCustomToken(uid);

module.exports = {
  initializeFirebase,
  isFirebaseEnabled,
  verifyIdToken,
  setUserRole,
  getUserByUid,
  getUserByEmail,
  getUserByPhoneNumber,
  deleteUser,
  createCustomToken,
  admin,
};
