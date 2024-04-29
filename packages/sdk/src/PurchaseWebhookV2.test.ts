import { randomUUID } from "crypto";

import { getHmacSignature } from "./crypto";
import { handlePurchaseWebhookV2 } from "./PurchaseWebhookV2";
import { Purchase, PurchaseWebhookV2 } from "./PurchaseWebhookV2";

type HandlePurchaseWebhookImplementationType = {
  someData1: string;
  webhook: PurchaseWebhookV2;
};

const handlePurchaseWebhookImplementation = (webhook: PurchaseWebhookV2): HandlePurchaseWebhookImplementationType => {
  const someRandomValue = randomUUID();

  return { someData1: someRandomValue, webhook };
};

const createPurchase = (): Purchase => {
  const id = randomUUID();

  return {
    id,
    isSandbox: false,
    checkoutId: id,
    shortId: "123",
    subtotalAmount: 22.33,
    taxAmount: 2.23,
    taxRate: 0.1,
    totalAmount: 24.56,
    currency: "USD",
    status: "completed",
    locale: "en-US",
    customerId: id,
    makerId: id,
    createdAt: new Date().toISOString(),
    items: [],
    events: [],
  };
};

const createPurchaseWebhook = (): PurchaseWebhookV2 => {
  const id = randomUUID();

  return {
    id,
    isSandbox: false,
    version: "2",
    type: "purchase.completed",
    data: { purchase: [createPurchase(), createPurchase()] },
  };
};

describe("webhook handlers test", () => {
  it("should call webhook implementation with a valid webhook", async () => {
    const sharedSecretKey = randomUUID();
    const purchaseWebhook = createPurchaseWebhook();
    const webhookJson = JSON.stringify(purchaseWebhook);
    const hmacSignature = getHmacSignature(webhookJson, sharedSecretKey);

    const handlerResult = handlePurchaseWebhookV2(handlePurchaseWebhookImplementation, {
      json: webhookJson,
      hmacSignature,
      sharedSecretKey,
    });

    expect(handlerResult).toBeTruthy();
    expect(handlerResult.someData1).toBeTruthy();
    expect(handlerResult.webhook).toEqual(purchaseWebhook);
  });
});
