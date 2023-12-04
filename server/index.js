const { secp256k1 } = require("ethereum-cryptography/secp256k1")
const { utf8ToBytes, toHex, hexToBytes } = require("ethereum-cryptography/utils")
const { sha256 } = require("ethereum-cryptography/sha256")

const fs = require('fs');
const https = require('https');
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

// Paths to your certificate files
const privateKeyPath = '/etc/letsencrypt/live/tools.utopiaai.world/privkey.pem';
const certificatePath = '/etc/letsencrypt/live/tools.utopiaai.world/fullchain.pem';

// Read the SSL certificate files
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');

const credentials = { key: privateKey, cert: certificate };



const message = "I ate your cake sorry"
const messageBytes = utf8ToBytes(message)
const messageHash = toHex(messageBytes)

//const privateKey = "0342e5b4d9a0f711b77f72b505537ef7f6dfc5614431d51e8d2b515a2f9b9f9c"

const balances = {
  "032c45a3124bb450ba2346efe561302553d6dbc40d508a8e685ceb06660eab63d0": 100,
  "03d3094af88ee223df6cf41c6153118beda80895b5087dc0ca0db895df1663d839": 50,
  "031ab91e7af86f363bf88b6a8091c397573456c0914933f2ed0f3fe6ee1b287633": 75,
};

app.get("/balance/:publicKey", (req, res) => {
  const { publicKey } = req.params;


  // const address = toHex(publicKey)

  const address = publicKey


  console.log(publicKey)


  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: get a signature from the client-side application
  //recover the public address from the signature, which will be the sender

  try {

    const { signature, recoveryBit, recipient, amount } = req.body;


  console.log("signature server2", signature)

  const _signature = secp256k1.Signature.fromCompact(signature).addRecoveryBit(recoveryBit)

  console.log(_signature, "_signature")




  const sender = _signature.recoverPublicKey(messageHash).toHex()

  console.log(sender, "sender")

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }

  } catch (err) {
    console.log(err)
  }
  
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Listening on port ${port} (HTTPS)`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
