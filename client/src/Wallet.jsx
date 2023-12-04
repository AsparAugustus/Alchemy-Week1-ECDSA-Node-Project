import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes, toHex, hexToBytes } from "ethereum-cryptography/utils.js";

const message = "I ate your cake sorry"
const messageBytes = utf8ToBytes(message)
const messageHash = toHex(messageBytes)

function Wallet({ privateKey, setPrivateKey, 
  address, setAddress, 
  signature, setSignature, 
  balance, setBalance }) {
  async function onChange(evt) {
    const _privateKey = evt.target.value;
    setPrivateKey(_privateKey);

    
    if (_privateKey && _privateKey.length === 64) {


      //sign a message with private key
      //use message to fetch public address

      const publicKey = toHex(secp256k1.getPublicKey(_privateKey))


      setAddress(publicKey)





      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
      setBalance(balance);



    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
    <h4>
    Example private key : 0342e5b4d9a0f711b77f72b505537ef7f6dfc5614431d51e8d2b515a2f9b9f9c
    </h4>
      
      <label>
        Private Key
        <input placeholder="Type in private key here" value={privateKey} onChange={onChange}></input>
      </label>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
