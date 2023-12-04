import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes, toHex, hexToBytes } from "ethereum-cryptography/utils.js";

const message = "I ate your cake sorry"
const messageBytes = utf8ToBytes(message)
const messageHash = toHex(messageBytes)



function Transfer({ privateKey, setBalance, signature, setSignature }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const [hasSignature, setHasSignature] = useState(false)

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function sign(evt) {
    evt.preventDefault();

    try {

      const signature = secp256k1.sign(messageHash, privateKey)

        console.log("here")
        setSignature(signature)
        setHasSignature(true)
  
        //returns a point in Elliptic curve
        const publicKeyPoint = signature.recoverPublicKey(messageHash)
        const publicKey = publicKeyPoint.toHex()

        alert("Signed successfully")
      
    } catch (err) {
      console.log(err)
    }

    
  
  }



  async function transfer(evt) {
    evt.preventDefault();

    console.log(signature, parseInt(sendAmount), recipient)

    console.log(typeof(signature), typeof(sendAmount), typeof(recipient))

    const recoveryBit = signature.recovery


    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: signature.toCompactHex(),
        recoveryBit: recoveryBit,
        amount: parseInt(sendAmount),
        recipient: recipient,
      });

      console.log("balance now", parseInt(balance))
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
    }
  }

  return (


    hasSignature ?
    <>
       <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
    </>
    :

    <>
       <form className="container transfer" onSubmit={sign}>
       <h1>Signature required</h1>

       <input type="submit" className="button" value="Sign" />

       </form>
    </>


 
  );
}

export default Transfer;
