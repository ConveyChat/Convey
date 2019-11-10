var abi = require('ethereumjs-abi')

function decodeMessage(message) {
    return abi.rawDecode(["string"], Buffer.from(message.substring(2), 'hex'))
}

module.exports = {
    decodeMessage: decodeMessage
}