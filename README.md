# Connexion
A layer 1 communication system through MetaMask snaps. Ethereum Name Service is leveraged to allow users to send messages to others using simple domain names instead of having to remember an etherum public key. IPFS is also leveraged to store the sender and recipient addresses, as well as the message. A smart contract is leveraged to push the IPFS hash of the message to the ethereum blockchain. Dfuse is used on the recipient side to listen to for new messages. The message is then accessed by IPFS hash and presented to the recipient. 

# Build Instructions

Connexion requires two computers to demo. The following steps must be completed for each computer:

Each of these must be set up with the Metamask (beta) extension located in `metamask-snaps-beta-build`. The following steps must the be completed for each computer:

### 1. Browserify required components (if they don't exist)

http://browserify.org/

```
cd snap/decoder
browserify decode.js -s decoder > decodeBundle.js

cd ../send
browserify send.js -s sender > sendBundle.js
```

### 2. Build and launch using Docker + Docker Compose

Run the following in the root directory:

```
docker-compose build && docker-compose up
```

Connexion should now be running at localhost:8081!
