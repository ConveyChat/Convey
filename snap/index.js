const msgListeners = [];
let totalMessages = 0;

wallet.registerApiRequestHandler(async origin => {
  return {
    registerNewMessage: msg => {
      let msgAsset = {
        symbol: `${totalMessages + 1}-msg`,
        balance: `0`,
        identifier: 'metamask-messaging-asset',
        image: 'https://i.imgur.com/1jYAmux.png',
        decimals: 0,
        customViewUrl: `http://localhost:8081/message?hash=${msg.hash}`
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
