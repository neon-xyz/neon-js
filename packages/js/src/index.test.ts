const NEON_JS_URL = "https://js.poweredbyneon.com/v1/neon.js";
const ENVIRONMENT_ID = "test-environment-id";

const dispatchScriptEvent = (eventType: string): void => {
  const injectedScript = document.querySelector(`script[src="${NEON_JS_URL}"]`);

  if (!injectedScript) {
    throw new Error("could not find Neon.js script element");
  }

  injectedScript.dispatchEvent(new Event(eventType));
};

describe("Module loader", () => {
  afterEach(() => {
    const scripts = document.querySelectorAll(`script[src="${NEON_JS_URL}"]`);
    for (let script of scripts) {
      script.parentElement?.removeChild(script);
    }
    delete window.Neon;
    jest.resetModules();
  });

  it("should inject the script tag after a tick", async () => {
    require("./index");

    expect(document.querySelector(`script[src="${NEON_JS_URL}"]`)).toBe(null);

    await Promise.resolve().then(() => {
      expect(document.querySelector(`script[src="${NEON_JS_URL}"]`)).not.toBe(null);
    });
  });

  it("does not inject the script when Neon.js is already loaded", async () => {
    require("./index");

    window.Neon = jest.fn((clientKey) => ({ clientKey })) as any;

    await new Promise((resolve) => setTimeout(resolve)).then(() => {
      expect(document.querySelector(`script[src="${NEON_JS_URL}"]`)).toBe(null);
    });
  });

  describe("existing scripts", () => {
    it.each([NEON_JS_URL, `${NEON_JS_URL}?query=param`, `${NEON_JS_URL}#hash`])(
      "does not duplicate the <script> tag when one is already present with the url %s",
      async () => {
        require("./index");

        const script = document.createElement("script");
        script.src = NEON_JS_URL;
        document.body.appendChild(script);

        await Promise.resolve();
        expect(document.querySelectorAll(`script[src^="https://js.poweredbyneon.com"]`)).toHaveLength(1);
      },
    );

    it("ignores non-Neon.js scripts", async () => {
      const script = document.createElement("script");
      script.src = "https://js.poweredbyneon.com/v1/not-neon.js";
      document.body.appendChild(script);

      expect(document.querySelectorAll('script[src^="https://js.poweredbyneon.com"]')).toHaveLength(1);
      expect(document.querySelector('script[src="https://js.poweredbyneon.com/v1/not-neon.js"]')).not.toBe(null);

      require("./index");

      await Promise.resolve();

      expect(document.querySelectorAll('script[src^="https://js.poweredbyneon.com"]')).toHaveLength(2);
      expect(document.querySelector('script[src="https://js.poweredbyneon.com/v1/not-neon.js"]')).not.toBe(null);
      expect(document.querySelector(`script[src="${NEON_JS_URL}"]`)).not.toBe(null);
    });
  });

  describe("loadNeonJs", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("resolves with a Neon object", async () => {
      const { loadNeonJs } = require("./index");
      const promise = loadNeonJs(ENVIRONMENT_ID);

      await Promise.resolve();
      window.Neon = jest.fn((environmentId) => ({ environmentId })) as any;
      dispatchScriptEvent("load");

      await expect(promise).resolves.toEqual({
        environmentId: ENVIRONMENT_ID,
      });
    });

    it("rejects when the script fails", async () => {
      const spy = jest.spyOn(console, "warn").mockReturnValue();
      const { loadNeonJs } = require("./index");
      const promise = loadNeonJs(ENVIRONMENT_ID);

      await Promise.resolve();
      dispatchScriptEvent("error");

      await expect(promise).rejects.toEqual(new Error("Failed to load Neon.js"));

      expect(spy).not.toHaveBeenCalled();
    });

    it("rejects when Neon is not added to the window for some reason", async () => {
      const { loadNeonJs } = require("./index");
      const promise = loadNeonJs(ENVIRONMENT_ID);

      await Promise.resolve();
      dispatchScriptEvent("load");

      return expect(promise).rejects.toEqual(new Error("Neon.js not available"));
    });

    it("does not cause unhandled rejects when the script fails", async () => {
      const spy = jest.spyOn(console, "warn").mockReturnValue();
      require("./index");

      await Promise.resolve();
      dispatchScriptEvent("error");

      // Turn the task loop to make sure the internal promise handler has been invoked
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(spy).toHaveBeenCalledWith(new Error("Failed to load Neon.js"));
    });
  });
});
