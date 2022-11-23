import React from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import SendMany from "./SendMany";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: "Stacks React Starter",
      icon: window.location.origin + "/logo512.png",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

function disconnect() {
  userSession.signUserOut("/");
}

const ConnectWallet = () => {
  if (userSession.isUserSignedIn()) {
    return (
      // display: flex;
      //   align-items: center;
      //   justify-content: center;
      <div className="">
        <button className="Connect " onClick={disconnect}>
          Disconnect Wallet
        </button>
        <p>mainnet: {userSession.loadUserData().profile.stxAddress.mainnet}</p>
        <p>testnet: {userSession.loadUserData().profile.stxAddress.testnet}</p>

        <SendMany/>
      </div>
    );
  }
  
  return (
    <div style={{height:'500px'}} className="d-flex align-items-center justify-content-center"><button  className="Connect  " onClick={authenticate}>
      Connect Wallet
    </button></div>
    
  );
};

export default ConnectWallet;
