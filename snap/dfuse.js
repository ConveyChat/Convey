const client = dfuseClient.createDfuseClient({
	// Replace 'web_abcdef12345678900000000000' with your own API key!
	apiKey: "web_d0b3cc56c01424f1049c0cd6e5d81ec0",
	network: "ropsten.eth.dfuse.io"
});

// You must use a `$cursor` variable so stream starts back at last marked cursor on reconnect!
const operation = `subscription {
  searchTransactions(indexName: LOGS, query: "address:0xfe1666cC9FAF6B91F724e3282e152bbbcAc246eB topic.0:b3dbe9e9894ca2c11cb6c80bd0b0bccb9f5b41d612dbeeda0d5474de40b874fe", lowBlockNum: -1, sort: ASC, limit: 100) {
    cursor
    undo
    node {
      hash
      nonce
      gasLimit
      gasPrice
      to
      block {
        number
        hash
        header {
          timestamp
        }
      }
      matchingLogs {
        address
        topics
        data
        blockIndex
        transactionIndex
      }
    }
  }
}
`;

async function main() {
	console.log("Listening for new messages...");
	const stream = await client.graphql(operation, message => {
		if (message.type === "data") {
      console.log(message);
      const raw = decoder.decodeMessage(message.data.searchTransactions.node.matchingLogs[0].data);
      const rawmsg = raw[0].split(":");
      if (rawmsg[0] === 'mm') {
        let msg = {
          sender: rawmsg[1],
          receiver: rawmsg[2],
          hash: rawmsg[3] 
        }
        send(msg);
      } else {
        console.log(`INVALID MESSAGE FORMAT: ${raw}`);
      }
		}

		if (message.type === "error") {
			const { errors, terminal } = message;
			console.log(errors);
		}

		if (message.type === "complete") {
			console.log("complete");
		}
	});

	// Waits until the stream completes, or forever
	await stream.join();
	await client.release();
}

main();
