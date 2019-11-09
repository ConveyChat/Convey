const IPFS = require("ipfs");

class IpfsNode {
	constructor() {
        this.init();
    }
    
    async init() {
        this.node = await IPFS.create();
    }

	async addFile() {
		const input = {
			test: "message"
		};

		const contentAdded = await this.node.add(Buffer.from(JSON.stringify(input)));

		console.log("Added file:", contentAdded[0].hash);

		const buffer = await this.node.cat(contentAdded[0].hash);

		console.log("Added contents:", buffer.toString());
		return contentAdded[0].hash;
    }
    
    async getFile() {
        const validCID = "QmPmZWkr7yavwicz4nFtJY7qumCA9hcSsbt415arh3nzzB";

        this.node.get(validCID, function(err, files) {
            files.forEach(file => {
                console.log(file.path);
                console.log(file.content.toString("utf8"));
            });
        });
    }
}

module.exports = IpfsNode;
