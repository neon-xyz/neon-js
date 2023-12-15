declare global {
  interface Window {
    Neon?: (environmentId: string) => Neon;
  }
}

export interface Checkout {
  mount(domId: string): void;
  unmount(): void;
}

export interface Neon {
  startEmbeddedCheckout(props: { checkoutId: string; email: string; phoneNumber: string }): Checkout;
}

export interface NeonConstructor {
  (environmentId: string): Neon;
}

export const loadNeonJs: (environmentId: string) => Promise<Neon | null>;
