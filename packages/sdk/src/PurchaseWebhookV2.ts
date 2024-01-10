import { isValidHmacSignature } from "./crypto";
import { NeonHandlerImplementationError, NeonHmacSignatureValidationError, NeonParseError } from "./errors";
import { getOrThrow, parseOrThrow, safeTry, unwrapOrThrow } from "./functions";
import { PurchaseSchemaV2, PurchaseWebhookSchemaV2 } from "./PurchaseWebhookV2Schemas";
import { z } from "zod";

export type Purchase = z.infer<typeof PurchaseSchemaV2>;

export type PurchaseWebhookV2 = z.infer<typeof PurchaseWebhookSchemaV2>;

export const handlePurchaseWebhookV2 = <TResult>(
  handlerImplementation: (webhookEvent: PurchaseWebhookV2) => TResult,
  webhook: {
    json: string;
    hmacSignature: string;
    sharedSecretKey: string;
  },
): TResult => {
  if (!isValidHmacSignature(webhook.json, webhook.hmacSignature, webhook.sharedSecretKey)) {
    throw new NeonHmacSignatureValidationError("invalid HMAC signature given shared secret key");
  }

  const jsonParseValue = getOrThrow(
    () => JSON.parse(webhook.json),
    (err) => new NeonParseError(err),
  );

  const schemaParseValue = parseOrThrow(PurchaseWebhookSchemaV2, jsonParseValue, (err) => new NeonParseError(err));

  const result: TResult = getOrThrow(
    () => handlerImplementation(schemaParseValue),
    (err) => new NeonHandlerImplementationError(err),
  );

  return result;
};
