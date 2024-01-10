import crypto from "crypto";

const HASH_SHA_256 = "sha256";
const HEX_ENCODING = "hex";

export const getHmacSignature = (data: string, sharedSecretKey: string): string => {
  const result = crypto.createHmac(HASH_SHA_256, sharedSecretKey).update(data).digest(HEX_ENCODING);

  return result;
};

/**
 * Validates that it is Neon that initiated the webhook or callback request. If one assumes that the secret key was not compromised,
 * then this authenticates Neon as the party that is sending the data. When validation is successful, this proves that the message was not altered
 * by any third party. The validation is implemented using symetric cryptography @see: https://en.wikipedia.org/wiki/HMAC
 *
 * @param data Callback or webhook data that was sent in the body of the request.
 * @param signature Signature that was computed by Neon using the shared secret that was defined for this webhook or callback.
 * @param sharedSecretKey This is the secret key that was configured for this webhook or callback and shared with Neon.
 *
 * @example
 * // In your webhook endpoint route
 * app.post("/webhook", (req, res) => {
 *   const eventData = JSON.stringify(req.body);
 *   const receivedSignature = req.headers["x-neon-digest"];
 *   if (typeof receivedSignature === "string" && verifyHmacSignature(eventData, receivedSignature)) {
 *     // process data here
 *     res.status(200).send("Valid event signature");
 *   } else {
 *     // Invalid signature, reject the data
 *     res.status(403).send("Invalid event signature");
 *   }
 * });
 *
 * @returns true when computed HMAC hash digest matches the value in x-neon-digest header and false otherwise.
 */
export const isValidHmacSignature = (data: string, signature: string, sharedSecretKey: string): boolean => {
  const hash = getHmacSignature(data, sharedSecretKey);

  return signature === hash;
};
