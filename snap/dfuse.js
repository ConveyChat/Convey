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
		}

		if (message.type === "error") {
			const { errors, terminal } = message;
			const paragraphNode = document.createElement("li");
			paragraphNode.innerText = `An error occurred ${JSON.stringify({
				errors,
				terminal
			})}`;

			document.body.prepend(paragraphNode);
		}

		if (message.type === "complete") {
			const paragraphNode = document.createElement("li");
			paragraphNode.innerText = "Completed";

			document.body.prepend(paragraphNode);
		}
	});

	// Waits until the stream completes, or forever
	await stream.join();
	await client.release();
}

main();
