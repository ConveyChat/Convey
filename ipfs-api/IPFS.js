//Required modules
const IpfsNode = require('./node.js');
const express = require("express");
const fs = require("fs");
const app = express();

const ipfs = new IpfsNode();
//Addfile router for adding file a local file to the IPFS network without any local node
app.get("/addfile", function(req, res) {
    res.send(ipfs.addFile())
});
//Getting the uploaded file via hash code.
app.get("/getfile", async function(req, res) {
    res.send(ipfs.getFile())
});

app.listen(3000, () => console.log("App listening on port 3000!"));
