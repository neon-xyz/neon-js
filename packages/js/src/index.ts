import { Neon, NeonConstructor } from "../types";
import { loadNeonJs as loadNeonJsType } from "../types";

const JS_URL = "https://js.poweredbyneon.com/v1/neon.js";
let neonJsPromise: Promise<NeonConstructor | null> | null = null;

const onLoad = (resolve: (value: NeonConstructor) => void, reject: (reason?: unknown) => void) => () => {
  if (window.Neon) {
    resolve(window.Neon);
  } else {
    reject(new Error("Neon.js not available"));
  }
};

const onError = (reject: (reason?: unknown) => void) => () => {
  reject(new Error("Failed to load Neon.js"));
};

export const findExistingScript = (): HTMLScriptElement | null => {
  const scripts = document.getElementsByTagName("script");

  for (let script of scripts) {
    if (script.src.startsWith(JS_URL)) {
      return script;
    }
  }

  return null;
};

let onErrorListener: (() => void) | null = null;
let onLoadListener: (() => void) | null = null;

const injectScript = () => {
  const script = document.createElement("script");
  script.src = JS_URL;
  script.async = true;

  document.body.appendChild(script);

  return script;
};

const loadScript = async (): Promise<NeonConstructor | null> => {
  // Ensure that we only attempt to load Neon.js at most once
  if (neonJsPromise !== null) {
    return neonJsPromise;
  }

  neonJsPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      // Resolve to null when imported server side. This makes the module
      // safe to import in an isomorphic code base.
      resolve(null);
      return;
    }

    if (window.Neon) {
      resolve(window.Neon);
      return;
    }

    try {
      let script = findExistingScript();

      if (script && onLoadListener && onErrorListener) {
        // This case can happen if there's an error loading the script

        // Clean up old script
        script.removeEventListener("load", onLoadListener);
        script.removeEventListener("error", onErrorListener);
        script.parentNode?.removeChild(script);

        // Re-inject script
        script = injectScript();
      } else if (!script) {
        script = injectScript();
      }

      onLoadListener = onLoad(resolve, reject);
      onErrorListener = onError(reject);

      script.addEventListener("load", onLoadListener);
      script.addEventListener("error", onErrorListener);
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
};

const neonPromise = Promise.resolve().then(() => loadScript());

let loadCalled = false;
neonPromise.catch((error: unknown) => {
  if (!loadCalled) {
    console.warn(error);
  }
});

export const loadNeonJs: typeof loadNeonJsType = async (environmentId) => {
  loadCalled = true;
  const Neon = await neonPromise;
  if (!Neon) {
    return null;
  }
  return Neon(environmentId);
};
