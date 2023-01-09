

import MetaMaskSDK from "@metamask/sdk";

export const instantiateSdk = () => {
  // in case we are rendering on the server,  
  // we don't want to instantiate the SDK when window is not defined
  if (typeof window === "undefined") {
    return null;
  }

  new MetaMaskSDK();
};