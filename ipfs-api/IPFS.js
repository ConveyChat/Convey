//Required modules
const IpfsNode = require('./node.js');
const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const ipfs = new IpfsNode();
//Addfile router for adding file a local file to the IPFS network without any local node
app.post("/addfile", async function(req, res) {
    res.send(await ipfs.addMessage(req.body))
});
//Getting the uploaded file via hash code.
app.get("/getfile", async function(req, res) {
    hashes = req.body.hashes

    res.send(await ipfs.getMessages(hashes))
});

app.listen(3000, () => console.log("App listening on port 3000!"));
