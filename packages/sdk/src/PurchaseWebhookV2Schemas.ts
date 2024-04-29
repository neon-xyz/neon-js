import { z } from "zod";

export const PurchaseItemSchemaV2 = z.object({
  sku: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  referencePrice: z.number(),
  referenceCurrency: z.string(),
  imageUrl: z.string(),
  backgroundCss: z.string().nullish(),
});

export enum PurchaseEventTypeV2 {
  sale = "sale",
  refund = "refund",
}
export const PurchaseEventSchemaV2 = z.object({
  id: z.string(),
  purchaseId: z.string(),
  paymentId: z.string().nullish(),
  type: z.nativeEnum(PurchaseEventTypeV2),
  amount: z.number(),
  currency: z.string(),
  createdAt: z.string(),
});

export const PurchaseSchemaV2 = z.object({
  id: z.string(),
  checkoutId: z.string(),
  shortId: z.string(),
  subtotalAmount: z.number(),
  taxAmount: z.number(),
  taxRate: z.number(),
  totalAmount: z.number(),
  currency: z.string(),
  status: z.string(),
  locale: z.string(),
  externalReferenceId: z.string().nullish(),
  externalMetadata: z.string().nullish(), // JSON-serialized
  customerId: z.string(),
  makerId: z.string(),
  propertyAccountId: z.string().nullish(),
  propertyAccountDisplayName: z.string().nullish(),
  isSandbox: z.boolean(),
  playerId: z.string().nullish(),
  paymentId: z.string().nullish(),
  createdAt: z.string(),
  items: z.array(PurchaseItemSchemaV2),
  events: z.array(PurchaseEventSchemaV2),
});

export const PurchaseWebhookSchemaV2 = z.object({
  id: z.string(),
  version: z.literal("2"),
  isSandbox: z.boolean(),
  type: z.literal("purchase.completed"),
  data: z.object({
    purchase: z.array(PurchaseSchemaV2),
  }),
});
