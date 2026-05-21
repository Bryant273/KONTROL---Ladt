import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, shouldThrow = true) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error(`[Quantum Engine] Firestore Error (${operationType}):`, JSON.stringify(errInfo));
  if (shouldThrow) {
    throw new Error(JSON.stringify(errInfo));
  }
  return errInfo;
}

import { doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';

/**
 * Methodical connectivity study: Verifies Firestore connectivity on initialization.
 */
export async function testConnection() {
  console.log("[Quantum Engine] Initiating methodical connectivity probe...");
  try {
    // Probe metadata for current database
    console.log(`[Quantum Engine] Target Database: ${firebaseConfig.firestoreDatabaseId}`);
    
    // Test doc probe (will likely fail with permission denied, which is a GOOD sign of connectivity)
    const probeDoc = doc(db, '_internal_', 'probe');
    await getDocFromServer(probeDoc);
    console.log("[Quantum Engine] Warning: Internal probe accessible (check rules).");
  } catch (error: any) {
    if (error?.message?.includes('offline') || error?.code === 'unavailable') {
      console.error("[Critical] Quantum Engine: Firestore UNREACHABLE. Check network or project provisioning.");
    } else if (error?.code === 'permission-denied') {
      console.log("[Quantum Engine] Connectivity validated via expected rejection.");
    } else {
      console.warn("[Quantum Engine] Probe result:", error?.code || error?.message);
    }
  }
}
