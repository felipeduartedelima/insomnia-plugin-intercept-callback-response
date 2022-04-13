const { setItem, getItem } = require('./cache');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const setResponseContext = async (ctx) => {
  const check = async () => {
    await wait(1000);
    const responseCallback = getItem(`response${ctx.getRequestId()}`, true);
    if (responseCallback) {
      ctx.setBody(Buffer.from(JSON.stringify(responseCallback)));
    } else {
      await check();
    }
  };

  await check();
};

module.exports = async ({ response }) => {
  const statusCode = response.getStatusCode();
  if (statusCode === 200) {
    setItem(`firstResponse${response.getRequestId()}`, response.getBody());
    await setResponseContext(response);
  }
}
