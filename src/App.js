import logo from "./logo.svg";
import "./App.css";
import ConnectWallet from "./components/ConnectWallet";
import ContractCallVote from "./components/ContractCallVote";
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Admin from "./components/Admin";

function App() {
  return (
    
    <>
     <BrowserRouter>
     <Routes>
     
  <Route path="/" element={<ConnectWallet />} />
  <Route path="/admin" element={<Admin />} />
  {/* <Route path="/books/:id" element={<Book />} /> */}
</Routes> 
    </BrowserRouter>
    </>
  );
}

export default App;
