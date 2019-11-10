    
const ethers = require('ethers');
const createKeccakHash = require('keccak')
const provider = ethers.getDefaultProvider('ropsten');

  async function send(ethAddress, ensName, msg) {
 
    var addr;
    const domain = ensName;
    const message = msg;

    // if its the ens
    if (domain.includes(".")) {
      provider.resolveName(domain).then(function(address) {
        console.log("Address: " + address);
        addr = address;
      });
    } else {
      addr = domain;
    }

    // if the address isn't valid
    // if (!toChecksumAddress(addr)) {
    //   alert('Address is not valid');
    //   return;
    // }

    //create JSON
    var obj = new Object();
    obj.receiver = addr;
    obj.sender = ethAddress;
    obj.body = message;

    const response = await fetch('http://localhost:3000/addfile', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: obj // body data type must match "Content-Type" header
    });
    //const body = await response.json();

    console.log(response);
  }

  module.exports = {
    send: send 
  };