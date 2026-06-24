import { loadNeonJs } from "@neonpay/js";

// Update Payment Method — embedded example
//
// Unlike Checkout and Subscription, this flow can't be run cold. It updates the card on an
// EXISTING subscription, so it has two prerequisites you must satisfy first:
//
//   1. An ALREADY-ACTIVE subscription (status `active` or `pending_cancellation`).
//   2. A short-lived update-payment-method *session token*, minted server-side via
//        POST /subscriptions/{subscriptionId}/update-payment-method
//      That call uses your secret API key, so it must run on your server — never in the
//      browser. Pass the two values from its response into the SDK:
//        - subscriptionToken = response.subscription.token
//        - token             = response.token
//
// The session token expires, so regenerate it if the flow stops loading. Both values are
// hardcoded below for the demo; in a real integration your server returns them on demand.

(async () => {
  const neon = await loadNeonJs("client-key");
  console.log(neon);
  neon
    .startEmbeddedSubscriptionUpdatePaymentMethod({
      subscriptionToken: "st_sandbox_3pQ7Zk2mXvB9nRtL6wYdF8cHsA1jE4uG0oKpN5rViXY",
      token: "k2Jd9fLpQ7mZ3xR8wYtN6vB1cHsA4uG0oKpE5rVi9XbF2lDqM7nTjW3yU8aZ4hC6gP1sK0eRoIxL5tBdQfNvM",
      email: "foo@neonpay.com",
    })
    .mount("#root");
})();
