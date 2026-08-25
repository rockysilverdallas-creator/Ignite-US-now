import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider with all requested Workspace Scopes
export const WORKSPACE_SCOPES = [
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/documents.readonly",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/presentations",
  "https://www.googleapis.com/auth/presentations.readonly",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/spreadsheets.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
];

const provider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach((scope) => {
  provider.addScope(scope);
});

// Flag & In-memory token caching (NOT in localStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token must be refreshed via interactive sign-in popup if lost on reload
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get access token from Firebase Auth");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Google Picker API initialization and trigger
declare global {
  interface Window {
    gapi?: any;
    google?: any;
  }
}

export const loadGooglePickerApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.gapi && window.google?.picker) {
      resolve();
      return;
    }

    if (!window.gapi) {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.gapi) {
          window.gapi.load("picker", {
            callback: () => resolve(),
            onerror: () => reject(new Error("Failed to load Google Picker")),
          });
        }
      };
      script.onerror = () => reject(new Error("Failed to load gapi script"));
      document.body.appendChild(script);
    } else {
      window.gapi.load("picker", {
        callback: () => resolve(),
        onerror: () => reject(new Error("Failed to load Google Picker")),
      });
    }
  });
};

export const openGooglePicker = async (
  onPicked: (doc: any) => void,
  options?: {
    viewId?: any; // e.g. DOCS, PRESENTATIONS, SPREADSHEETS
    title?: string;
  }
) => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Please sign in with Google to open Google Picker.");
  }

  await loadGooglePickerApi();

  if (!window.google?.picker) {
    throw new Error("Google Picker API is not available.");
  }

  const pickerOrigin =
    window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
      ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
      : window.location.origin;

  const view = options?.viewId
    ? new window.google.picker.DocsView(options.viewId)
    : new window.google.picker.DocsView(window.google.picker.ViewId.DOCS);

  view.setIncludeFolders(true);

  const builder = new window.google.picker.PickerBuilder()
    .addView(view)
    .addView(new window.google.picker.DocsView(window.google.picker.ViewId.PRESENTATIONS))
    .addView(new window.google.picker.DocsUploadView())
    .setOAuthToken(token)
    .setOrigin(pickerOrigin)
    .setTitle(options?.title || "Select Google Docs or Slides Deck")
    .setCallback((data: any) => {
      if (data.action === window.google.picker.Action.PICKED) {
        const file = data.docs[0];
        onPicked(file);
      }
    });

  const picker = builder.build();
  picker.setVisible(true);
};
