import { useConnect } from "@stacks/connect-react";
import { StacksTestnet } from "@stacks/network";

import {
  AnchorMode,
  bufferCV,
  falseCV,
  FungibleConditionCode,
  intCV,
  listCV,
  makeStandardSTXPostCondition,
  PostConditionMode,
  stringUtf8CV,
  trueCV,
  tupleCV,
  uintCV,
} from "@stacks/transactions";
import { useEffect, useState } from "react";
import { userSession } from "./ConnectWallet";
import axios from "axios";
import React from "react";
import { principalCV } from "@stacks/transactions/dist/clarity/types/principalCV";

const SendMany = () => {
  const stxAddress = userSession.loadUserData().profile.stxAddress.testnet;
  const { doContractCall, doSTXTransfer } = useConnect();

  let [recipient, setRecipient] = useState([]);
  const [demo, setDemo] = useState([]);
  const [balances, setBalance] = useState(0);
  const [stxInput, setStxInput] = useState(0);
  const [response, setResponse] = useState('');
  let add = [];

  useEffect(() => {
    getBalances();
  }, [balances]);

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  // get stx balance
  const getBalances = async () => {
    const a = [
      {
        username: "q",
        email: "1",
        ustx: 21000000,
        quantity:6,
        address: "ST1YJYJKZJRHZSKGFPM97J0RVQYMKQHNW328C4A1J",
        memo: "foso",
      },
      {
        username: "q",
        email: "2",
        ustx: 21000000,
        quantity:2,
        address: "ST27XGZFXEJ0DTJMFX9PTZ3BFVA1XDF5RXK7G6N1Q",
        memo: "foso",
      },
      {
        username: "q",
        email: "3",
        ustx: 21000000,
        quantity:3,
        address: "ST2AQCG4BER2PVYQCA32ZG0CVQ2PE85VNN73TV7EY",
        memo: "foso",
      },
    ];
    setDemo(a);
    const principal = stxAddress;
    console.log(principal);
    axios
      .get(
        `https://stacks-node-api.testnet.stacks.co/extended/v1/address/${principal}/balances`
      )
      .then(function (response) {
        setBalance(parseInt(response.data.stx.balance) / 1000000);
        console.log(response.data.stx.balance);
      });
  };

  // get transaction status
  const getTransactionStatus = async (e) => {
    axios
      .get(`https://stacks-node-api.testnet.stacks.co/extended/v1/tx/${e}`)
      .then((e) => {
        setResponse(e.data.tx_status);
      });
  };
  
  const getRecipients = (res, e) => {
    const newArr = add.filter((object) => {
      return object.to !== res.to;
    });
    e ? add.push(res) : (add = newArr);
    recipient = add;
    console.log("add", add);
  };
  const sendOne = (res) => {
    recipient = [res];
    console.log('recipient', recipient);
    handleOpenContractCall();
  };

  const handleOpenContractCall = () => {
    let a = [];
    let Pustx = 0;
    recipient.forEach((e) => {
      const ustxN = parseInt(e.ustx);
      const v = tupleCV({
        ustx: uintCV(ustxN),
        to: principalCV(e.to),
        memo: bufferCV(Buffer.from(e.memo)),
      });

      a.push(v);
    });

    recipient.forEach((e) => {
      Pustx += e.ustx;
      // return Pustx
    });
    console.log(Pustx);
if(Pustx>balances*1000000){
    setResponse('insufficient balance');
}else{
  setResponse('');
    doContractCall({
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "ST27XGZFXEJ0DTJMFX9PTZ3BFVA1XDF5RXK7G6N1Q",
      contractName: "bloodfuse-payment-system",
      functionName: "send-many",
      functionArgs: [listCV(a)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardSTXPostCondition(
          stxAddress,
          FungibleConditionCode.LessEqual,
          Pustx
        ),
      ],
      onFinish: (data) => {
        console.log("onFinish:", data);
        getTransactionStatus(data.txId);
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
}
  };
 
  if (!userSession.isUserSignedIn()) {
    return null;
  }

  return (
    <><center>
      <div class="card" style={{width:'18rem'}}>
  
  <div class="card-body">
    <h5 class="card-title">BloodFuse</h5>
    <br />
    <h4>{response}</h4>
    <input onChange={(e)=>setStxInput(e.target.value)} style={{border:'none',textAlign:'center'}} placeholder="Input Quantity " type="number" />
    <br />
    <br />
    <button onClick={()=>sendOne({
        ustx: 21000000*stxInput,
       
        to: "ST1YJYJKZJRHZSKGFPM97J0RVQYMKQHNW328C4A1J",
        memo: "foso",
      })} class="btn btn-primary">Pay</button>
  </div>
</div>
</center>
    </>
  );
};
export default SendMany;
