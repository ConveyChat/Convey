wallet.registerRpcMessageHandler(async (originString, requestString) => {
  switch (requestString) {
    case 'log_accounts':
      return await wallet.send({ method: 'eth_accounts' });
    default:
      throw new Error('invalid');
  }
});
