var provider = 'window.ethereum';

async function send(ethAddress, ensName, msg) {
  var addr;
  const domain = ensName;
  const message = msg;

  // if its the ens
  if (domain.includes('.')) {
    provider.resolveName(domain).then(function(address) {
      console.log('Address: ' + address);
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
  let obj = {
    receiver: addr,
    sender: ethAddress,
    body: message
  };

  const response = await fetch('http://localhost:3000/addfile', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json'
    },
    body: obj
  });

  //const body = await response.json();

  console.log(response);
}

module.exports = {
  send: send
};
