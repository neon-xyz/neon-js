import { loadNeonJs } from "@neonpay/js";

(async () => {
  const neon = await loadNeonJs("client-key");
  console.log(neon);
  neon
    .startEmbeddedSubscription({
      subscriptionToken: "st_sandbox_3pQ7Zk2mXvB9nRtL6wYdF8cHsA1jE4uG0oKpN5rViXY",
      email: "foo@neonpay.com",
    })
    .mount("#root");
})();
