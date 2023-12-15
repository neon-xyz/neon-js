const NEON_JS_URL = "https://js.poweredbyneon.com/v1/neon.js"
const ENVIRONMENT_ID = "test-environment-id";

const dispatchScriptEvent = (eventType: string): void => {
  const injectedScript = document.querySelector(
    `script[src="${NEON_JS_URL}"]`
  );

  if (!injectedScript) {
    throw new Error('could not find Neon.js script element');
  }

  injectedScript.dispatchEvent(new Event(eventType));
};

describe("Module loader", () => {
  afterEach(() => {
    const script = document.querySelector(`script[src="${NEON_JS_URL}"]`);
    if (script && script.parentElement) {
      script.parentElement.removeChild(script);
    }
    delete window.Neon;
    jest.resetModules();
  });

  it("should inject the script tag after a tick", async () => {
    require('./index');

    expect(
      document.querySelector(`script[src="${NEON_JS_URL}"]`)
    ).toBe(null);

    await Promise.resolve().then(() => {
      expect(
        document.querySelector(`script[src="${NEON_JS_URL}"]`)
      ).not.toBe(null);
    });
  });

  describe("loadNeonJs", () => {
    it("resolves with a Neon object", async () => {
      const { loadNeonJs } = require("./index");
      const promise = loadNeonJs(ENVIRONMENT_ID);

      await new Promise((resolve) => setTimeout(resolve));
      window.Neon = jest.fn((environmentId) => ({ environmentId })) as any;
      dispatchScriptEvent('load');

      return expect(promise).resolves.toEqual({ environmentId: ENVIRONMENT_ID });
    });
  });
});
