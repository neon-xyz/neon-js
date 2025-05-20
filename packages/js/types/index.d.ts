declare global {
  interface Window {
    Neon?: NeonConstructor;
  }
}

export interface Checkout {
  on(
    event: "checkout.amounts_updated" | "purchase.completed",
    callback:
      | ((data: PurchaseCompletedCallbackData) => void)
      | ((data: { itemTotal: number; subtotalAmount: number; taxAmount: number; totalAmount: number }) => void),
  ): void;
  off(
    event: "purchase.completed" | "checkout.amounts_updated",
    callback:
      | ((data: PurchaseCompletedCallbackData) => void)
      | ((data: { itemTotal: number; subtotalAmount: number; taxAmount: number; totalAmount: number }) => void),
  ): void;
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
