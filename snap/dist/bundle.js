() => (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1])