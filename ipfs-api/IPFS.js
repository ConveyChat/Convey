//Required modules
const ipfsAPI = require('ipfs-http-client');
const express = require('express');
const fs = require('fs');
const app = express();

//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI('ropsten.infura.io/v3/dada9d263fc14f50ac995ca0ac78c7e9', '5001', {protocol: 'https'})

//Addfile router for adding file a local file to the IPFS network without any local node
app.get('/addfile', function(req, res) {
    const input = {
        "test": "message"
    }

    ipfs.add(Buffer.from(input), function (err, file) {
        if (err) {
          console.log(err);
        }
        console.log(file)
      })

})
//Getting the uploaded file via hash code.
app.get('/getfile', function(req, res) {
    
    //This hash is returned hash of addFile router.
    const validCID = 'HASH_CODE'

    ipfs.get(validCID, function (err, files) {
        files.forEach((file) => {
          console.log(file.path)
          console.log(file.content.toString('utf8'))
        })
      })

})

app.listen(3000, () => console.log('App listening on port 3000!'))

