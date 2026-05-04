declare global {
  interface Window {
    Neon?: NeonConstructor;
  }
}

export type CheckoutAmountsUpdatedCallbackData = {
  itemTotal: number;
  subtotalAmount: number | null;
  taxAmount: number | null;
  taxRate: number | null;
  totalAmount: number | null;
};
export type PurchaseCompletedCallbackData = { checkout: { id: string; purchaseId: string } };
export type PaymentStartedCallbackData = { checkout: { id: string } };
export type PaymentFailedCallbackData = {
  checkout: { id: string };
  error: { errorMessage: string };
};
export type SwitchCountryCallbackData = {
  checkout: {
    id: string;
  };
  paymentMethodCountry: string | undefined;
  paymentMethodCountryCode: string | undefined;
};

/**
 * Tracking-consent state passed from the merchant's site to the embedded checkout.
 *
 *  - `Consented`: the user accepted tracking on the merchant's banner. Embedded checkout
 *     enables analytics and skips its own consent UI.
 *  - `Declined`: the user declined on the merchant's banner. Embedded checkout disables
 *     analytics and skips its own consent UI.
 *  - `NotSet` (default when omitted): the merchant hasn't shared a decision. Embedded
 *     checkout falls back to country-based defaults.
 */
export const TrackingConsent: {
  readonly Consented: "consented";
  readonly Declined: "declined";
  readonly NotSet: "not_set";
};
export type TrackingConsent = (typeof TrackingConsent)[keyof typeof TrackingConsent];

export interface Checkout {
  on(event: "ready", callback: () => void): void;
  on(event: "purchase.completed", callback: (data: PurchaseCompletedCallbackData) => void): void;
  on(event: "checkout.amounts_updated", callback: (data: CheckoutAmountsUpdatedCallbackData) => void): void;
  on(event: "payment.started", callback: (data: PaymentStartedCallbackData) => void): void;
  on(event: "payment.failed", callback: (data: PaymentFailedCallbackData) => void): void;
  on(event: "payment.switch_country", callback: (data: SwitchCountryCallbackData) => void): void;
  off(event: "ready", callback: () => void): void;
  off(event: "purchase.completed", callback: (data: PurchaseCompletedCallbackData) => void): void;
  off(event: "checkout.amounts_updated", callback: (data: CheckoutAmountsUpdatedCallbackData) => void): void;
  off(event: "payment.started", callback: (data: PaymentStartedCallbackData) => void): void;
  off(event: "payment.failed", callback: (data: PaymentFailedCallbackData) => void): void;
  off(event: "payment.switch_country", callback: (data: SwitchCountryCallbackData) => void): void;
  mount(domId: string): void;
  unmount(): void;
  setTrackingConsent(consent: Exclude<TrackingConsent, "not_set">): void;
}

export interface Neon {
  startEmbeddedCheckout(props: {
    checkoutId: string;
    checkoutToken: string;
    email?: string | null | undefined;
    phoneNumber?: string | null | undefined;
    hideItems?: boolean;
    hidePromoCodeInput?: boolean;
    hideAmounts?: boolean;
    fromRedirect?: boolean;
    /**
     * Tracking-consent state from the merchant's banner. Defaults to
     * `TrackingConsent.NotSet` (country-based defaults apply) when omitted.
     */
    trackingConsent?: TrackingConsent;
  }): Checkout;
}

export interface NeonConstructor {
  (clientKey: string): Neon;
}

export const loadNeonJs: (clientKey: string) => Promise<Neon | null>;
