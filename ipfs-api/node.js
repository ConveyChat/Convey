const IPFS = require('ipfs');

class IpfsNode {
  constructor() {
    this.init();
  }

  async init() {
    this.node = await IPFS.create();
  }

  async addMessage(input) {
    const contentAdded = await this.node.add(
      Buffer.from(JSON.stringify(input))
    );

    console.log('Added:', contentAdded[0].hash);

    const buffer = await this.node.cat(contentAdded[0].hash);

    console.log('Added contents:', buffer.toString());
    return contentAdded[0].hash;
  }

  async getMessage(hash) {
    let messageArr = [];

    var messages = await this.node.get(hash);
    // console.log(messages)
    messages.forEach(message => {
      messageArr.push(message.content.toString('utf8'));
    });

    return messageArr[0];
  }
}

module.exports = IpfsNode;
