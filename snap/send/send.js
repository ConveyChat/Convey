const ethers = require('ethers');
const provider = ethers.getDefaultProvider('ropsten');
const axios = require('axios').default;

async function send(ethAddress, ensName, msg) {
  var addr;
  const domain = ensName;
  const message = msg;

  // if its the ens
  if (domain.includes('.eth')) {
    const resolvedAddr = await provider.resolveName(domain);
    console.log('Resolved Address: ', resolvedAddr);
    addr = resolvedAddr;
  } else {
    addr = domain;
  }

  const response = await axios.post('http://localhost:3000/addfile', {
    receiver: addr,
    sender: ethAddress,
    body: message
  });
  return {
    hash: response.data,
    receiver: addr
  };
}

module.exports = {
  send: send
};
