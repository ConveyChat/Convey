    
const ethers = require('ethers');
const createKeccakHash = require('keccak')
var provider = "window.ethereum";

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

  async function toChecksumAddress (address) {
    address = address.toLowerCase().replace('0x', '')
    var hash = createKeccakHash('keccak256').update(address).digest('hex')
    var ret = '0x'

    for (var i = 0; i < address.length; i++) {
      if (parseInt(hash[i], 16) >= 8) {
        ret += address[i].toUpperCase()
      } else {
        ret += address[i]
      }
  }

  return ret
}

  module.exports = {
    send: send 
  };