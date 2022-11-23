import { useConnect } from "@stacks/connect-react";
import { StacksTestnet } from "@stacks/network";
import '../index.css'
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

export default function Admin() {
  const stxAddress = userSession.loadUserData().profile.stxAddress.testnet;
  const { doContractCall, doSTXTransfer } = useConnect();

  let [recipient, setRecipient] = useState([]);
  const [demo, setDemo] = useState([]);
  const [balances, setBalance] = useState(0);
  const [response, setResponse] = useState(null);
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
        quantity: 6,
        address: "ST1YJYJKZJRHZSKGFPM97J0RVQYMKQHNW328C4A1J",
        memo: "foso",
      },
      {
        username: "q",
        email: "2",
        ustx: 21000000,
        quantity: 2,
        address: "ST27XGZFXEJ0DTJMFX9PTZ3BFVA1XDF5RXK7G6N1Q",
        memo: "foso",
      },
      {
        username: "q",
        email: "3",
        ustx: 21000000,
        quantity: 3,
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
}else {
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
    <>
      <div className=" bg-darkS">
        <div className="d-flex">
          <div className="d-flex align-items-center " id="navbar">
            {" "}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbar-items"
              aria-controls="navbarSupportedContent"
              aria-expanded="true"
              aria-label="Toggle navigation"
            >
              {" "}
              <span className="fas fa-bars"></span>{" "}
            </button>{" "}
            <a className="text-decoration-none fs14 ps-2" href="#">
              Bloodfuse<span className="fs13 pe-2">.com</span>
            </a>{" "}
          </div>
          <div id="navbar2" className="d-flex justify-content-end pe-4">
            {" "}
            <span className="far fa-user-circle "></span>{" "}
          </div>
        </div>
        <div className="d-md-flex">
          <ul id="navbar-items" className="p-0">
            <li>
              {" "}
              <span className="fas fa-th-list"></span>{" "}
              <span className="ps-3 name">Dashboard</span>{" "}
            </li>
            <li>
              {" "}
              <span className="fas fa-chart-line"></span>{" "}
              <span className="ps-3 name">TRANSACTIONS</span>{" "}
            </li>
          </ul>
          <div id="topnavbar">
            <div className="d-flex  align-items-center mb-3 px-md-3 px-2">
              {" "}
              <span className="text-uppercase fs13 fw-bolder pe-3">
                search<span className="ps-1">by</span>
              </span>
              <form className="example d-flex align-items-center">
                {" "}
                <input type="text" placeholder="..." name="search" />{" "}
                
              </form>
              <h3>{response}</h3>
              <h3>{balances} STX</h3>
            </div>

            
            <div className="table-responsive px-2">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Memo</th>
                    <th scope="col">Address</th>
                    <th scope="col">Quantity of Blood</th>
                    <th className="text-center" scope="col">
                      ustx
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {demo?.map((rec) => {
                    return (
                      <tr key={rec.address}>
                        <input
                          onChange={(e) =>
                            getRecipients(
                              {
                                to: rec.address,
                                ustx: rec.ustx * rec.quantity,
                                memo: rec.memo,
                              },
                              e.target.checked
                            )
                          }
                          type="checkbox"
                          name=""
                          id=""
                        />
                        <td>{rec.username}</td>
                        <td>{rec.email}</td>
                        <td>{rec.memo}</td>
                        <td>{rec.address}</td>
                        <td>{rec.quantity}</td>
                        <td>{rec.ustx}</td>
                        <button
                          className="btn btn-outline-success m-2"
                          onClick={() =>
                            sendOne({
                              to: rec.address,
                              ustx: rec.ustx * rec.quantity,
                              memo: rec.memo,
                            })
                          }
                        >
                          {" "}
                          Pay
                        </button>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="d-flex align-items-center justify-content-between px-3 mt-3">
              <div className="bg-bdark fs13">
                {" "}
                <span>Page</span>{" "}
                <input className="input-10 text-center" type="text" value="1" />{" "}
                <span>
                  <span className="px-1">of</span>1
                </span>{" "}
              </div>
              <button
                className="d-flex justify-content-end bg-bdark fs13 btn btn-outline-success"
                onClick={handleOpenContractCall}
              >
                {" "}
                Disburse 
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
