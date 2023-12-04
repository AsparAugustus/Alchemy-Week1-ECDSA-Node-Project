import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1"

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("")
  const [signature, setSignature] = useState()

  return (
    <div className="app">

      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        address={address}
        setAddress={setAddress}
        signature={signature}
        setSignature={setSignature}
      />
      <Transfer 
        setBalance={setBalance}
        privateKey={privateKey}
        signature={signature}
        setSignature={setSignature}
       />
    </div>
  );
}

export default App;
