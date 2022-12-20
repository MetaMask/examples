

import MetaMaskSDK from "@metamask/sdk";

export const instantiateSdk = () => {
  if (typeof window === undefined) {
    return null;
  }

  new MetaMaskSDK();
};