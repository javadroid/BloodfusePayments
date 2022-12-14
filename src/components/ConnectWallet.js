import React from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import SendMany from "./SendMany";
import { Link, Navigate } from "react-router-dom";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: "Bloodfuse",
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
        <center>
        <button className="Connect " onClick={disconnect}>
          Disconnect Wallet
        </button>
        <br />
        <br />
        <button className="Connect " >
        <Link to={`/admin`}>Admin</Link>
        </button>
        <p>mainnet: {userSession.loadUserData().profile.stxAddress.mainnet}</p>
        <p>testnet: {userSession.loadUserData().profile.stxAddress.testnet}</p>
        </center>
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
