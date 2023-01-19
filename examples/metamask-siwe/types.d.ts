import { type MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      address: string;
      signature?: string;
    };
  }
}