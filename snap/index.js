const msgListeners = [];
let totalMessages = 0;

wallet.registerApiRequestHandler(async origin => {
  return {
    registerNewMessage: msg => {
      let msgAsset = {
        symbol: 'MESSAGE-' + (totalMessages + 1).toString(),
        balance: '',
        identifier: 'metamask-messaging-asset',
        image: 'https://placekitten.com/200/200',
        decimals: 0,
        customViewUrl:
          'http://localhost:8081/message.html?id=' +
          (totalMessages + 1).toString()
      };

      trackMessages(origin, msg);

      wallet.send({
        method: 'wallet_manageAssets',
        params: ['addAsset', msgAsset]
      });

      return { success: true };
    },

    on: (eventName, callback) => {
      switch (eventName) {
        case 'newMessage':
          msgListeners.push(callback);
          return true;
        default:
          throw rpcErrors.methodNotFound(requestObject);
      }
    }
  };
});

function trackMessages(origin, msg) {
  totalMessages++;
  const notice = {
    origin,
    msg
  };
  msgListeners.forEach(listener => {
    listener(notice).catch(err => {
      console.error("Couldn't send message to listener");
    });
  });
}
