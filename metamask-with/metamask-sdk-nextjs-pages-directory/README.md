This is an example of how to use the MetaMask SDK inside a Next.js application using the pages directory.

## Getting Started

First install dependencies

```bash
npm install
// or
yarn
// or
pnpm install
```

Then run the development server:

```bash
npm run dev
// or
yarn dev
// or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start using the app.Thi

## Hooks:

This includes some useful hooks to get you started quickly

- [useListen](/hooks/useListen.tsx) - Listen for events from the MetaMask provider.
- [useMetaMask](/hooks/useMetaMask.tsx) - Get the wallet information. Implemented in a reducer with context

These hooks are implemented in the [pages/index.tsx](/pages/index.tsx) file. You can use them as a reference.

## SdkProvider

The SdkProvider is a wrapper around the MetaMask provider. It takes care of instantiating the provider. Once the provider is instantiated, requesting a connection will open a modal for mobile in the case the wallet extension is not detected.
