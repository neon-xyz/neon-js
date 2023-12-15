import { Neon, NeonConstructor } from "../types"
import { loadNeonJs as loadNeonJsType } from "../types"

let neonJsPromise: Promise<NeonConstructor | null> | null = null;

const onLoad = (resolve: (value: any) => void, reject: (reason?: any) => void) => () => {
  if (window.Neon) {
    resolve(window.Neon);
  } else {
    reject(new Error('Neon.js not available'));
  }
}

const onError = (reject: (reason?: any) => void) => () => {
  reject(new Error('Failed to load Neon.js'));
};

const loadScript = async (): Promise<NeonConstructor | null> => {
  // Ensure that we only attempt to load Neon.js at most once
  if (neonJsPromise !== null) {
    return neonJsPromise;
  }

  neonJsPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // Resolve to null when imported server side. This makes the module
      // safe to import in an isomorphic code base.
      resolve(null);
      return;
    }

    try {
      const script = document.createElement('script');
      script.src = "https://js.poweredbyneon.com/v1/neon.js";

      document.body.appendChild(script);

      script.addEventListener("load", onLoad(resolve, reject));
      script.addEventListener("error", onError(reject));
    } catch (e) {
      reject(e);
      return;
    }
  });

  // Resets neonJsPromise on error
  return neonJsPromise.catch((error: unknown) => {
    neonJsPromise = null;
    return Promise.reject(error);
  });
}

const neonPromise = Promise.resolve().then(() => loadScript());

export default neonPromise

export const loadNeonJs: typeof loadNeonJsType = async (environmentId) => {
  const Neon = await neonPromise;
  if (!Neon) {
    return null;
  }
  return Neon(environmentId)
}
