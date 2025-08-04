declare global {
  interface Window {
    Neon?: NeonConstructor;
  }
}

export interface Checkout {
  on(event: "ready", callback: () => void): void;
  on(event: "purchase.completed", callback: (data: PurchaseCompletedCallbackData) => void): void;
  on(
    event: "checkout.amounts_updated",
    callback: (data: { itemTotal: number; subtotalAmount: number; taxAmount: number; totalAmount: number }) => void,
  ): void;
  on(event: "payment.started", callback: (data: PaymentStartedCallbackData) => void): void;
  on(event: "payment.failed", callback: (data: PaymentFailedCallbackData) => void): void;
  on(event: "payment.switch_country", callback: (data: SwitchCountryEventData) => void): void;
  off(event: "ready", callback: () => void): void;
  off(event: "purchase.completed", callback: (data: PurchaseCompletedCallbackData) => void): void;
  off(
    event: "checkout.amounts_updated",
    callback: (data: { itemTotal: number; subtotalAmount: number; taxAmount: number; totalAmount: number }) => void,
  ): void;
  off(event: "payment.started", callback: (data: PaymentStartedCallbackData) => void): void;
  off(event: "payment.failed", callback: (data: PaymentFailedCallbackData) => void): void;
  off(event: "payment.switch_country", callback: (data: SwitchCountryEventData) => void): void;
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
