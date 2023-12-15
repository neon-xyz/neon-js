# Neon.js ES Module

This package is a wrapper around Neon.js which provides an easier integration for modern web applications. In order to maintain PCI compliance, this package always loads the latest version of Neon.js directly.

[![npm](https://img.shields.io/npm/v/%40neonpay%2Fjs)](https://www.npmjs.com/package/@neonpay/js)

## Installation

```bash
# npm
npm install --save @neonpay/js

# yarn
yarn add @neonpay/js
```

## Usage

See the [`examples/`](https://github.com/neon-xyz/neon-js/blob/main/examples) directory for example usages.

### `loadNeonJs`

This function returns a `Promise` that returns a `Neon` object.

```typscript
import { loadNeonJs } from "@neonpay/js";

const neon = await loadNeonJs("your-environment-id");
```

## Reference

- [Neon Documentation](https://docs.neonpay.com/docs)
