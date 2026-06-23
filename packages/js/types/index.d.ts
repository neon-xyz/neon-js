declare global {
  interface Window {
    Neon?: NeonConstructor;
  }
}

/////////////////////
// CHECKOUT EVENTS //
/////////////////////

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

export type TrackingConsent = "consented" | "declined" | "not_set";

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

/////////////////////////
// SUBSCRIPTION EVENTS //
/////////////////////////

export type SubscriptionActivatedCallbackData = { subscription: { id: string } };
export type PaymentMethodUpdatedCallbackData = { subscription: { id: string } };
export type SubscriptionFailedCallbackData = {
  subscription: { id: string };
  error: { errorMessage: string };
};
export type SubscriptionSwitchCountryCallbackData = {
  subscription: { id: string };
  paymentMethodCountryCode: string | undefined;
  paymentMethodCountry: string | undefined;
};

export interface Subscription {
  on(event: "ready", callback: () => void): void;
  on(event: "subscription.activated", callback: (data: SubscriptionActivatedCallbackData) => void): void;
  on(event: "subscription.failed", callback: (data: SubscriptionFailedCallbackData) => void): void;
  on(event: "subscription.switch_country", callback: (data: SubscriptionSwitchCountryCallbackData) => void): void;
  on(event: "payment_method.updated", callback: (data: PaymentMethodUpdatedCallbackData) => void): void;
  off(event: "ready", callback: () => void): void;
  off(event: "subscription.activated", callback: (data: SubscriptionActivatedCallbackData) => void): void;
  off(event: "subscription.failed", callback: (data: SubscriptionFailedCallbackData) => void): void;
  off(event: "subscription.switch_country", callback: (data: SubscriptionSwitchCountryCallbackData) => void): void;
  off(event: "payment_method.updated", callback: (data: PaymentMethodUpdatedCallbackData) => void): void;
  mount(domId: string): void;
  unmount(): void;
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
    trackingConsent?: TrackingConsent;
  }): Checkout;
  startEmbeddedSubscription(props: {
    subscriptionToken: string;
    email?: string | null | undefined;
    hideItems?: boolean;
    hideAmounts?: boolean;
    fromRedirect?: boolean;
  }): Subscription;
  startEmbeddedSubscriptionUpdatePaymentMethod(props: {
    subscriptionToken: string;
    token: string;
    email?: string | null | undefined;
    fromRedirect?: boolean;
  }): Subscription;
}

export interface NeonConstructor {
  (clientKey: string): Neon;
}

export const loadNeonJs: (clientKey: string) => Promise<Neon | null>;
