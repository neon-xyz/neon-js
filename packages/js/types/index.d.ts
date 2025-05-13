declare global {
  interface Window {
    Neon?: NeonConstructor;
  }
}

export interface Checkout {
  mount(domId: string): void;
  unmount(): void;
}

export interface Neon {
  startEmbeddedCheckout(props: { checkoutId: string; email?: string; phoneNumber?: string }): Checkout;
}

export interface NeonConstructor {
  (clientKey: string): Neon;
}

export const loadNeonJs: (clientKey: string) => Promise<Neon | null>;
