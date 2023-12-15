import { loadNeonJs } from "@neonpay/js";

(async () => {
  const neon = await loadNeonJs("environment-id");
  console.log(neon);
  neon
    .startEmbeddedCheckout({
      checkoutId: "4849f34d-966c-4d56-9015-122aca7f9f1b",
      email: "foo@neonpay.com",
      phoneNumber: "1234567890",
    })
    .mount("#root");
})();
