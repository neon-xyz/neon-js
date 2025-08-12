declare global {
  interface Window {
    Neon?: NeonConstructor;
  }
}

export type CheckoutAmountsUpdatedCallbackData = {
  itemTotal: number;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
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
}

export interface Neon {
  startEmbeddedCheckout(props: {
    checkoutId: string;
    email?: string | null | undefined;
    phoneNumber?: string | null | undefined;
    hideItems?: boolean;
    hidePromoCodeInput?: boolean;
    hideAmounts?: boolean;
    fromRedirect?: boolean;
  }): Checkout;
}

export interface NeonConstructor {
  (clientKey: string): Neon;
}

export const loadNeonJs: (clientKey: string) => Promise<Neon | null>;
