const express = require('express');
const ngrok = require('ngrok');

const cachedItems = {};

const getItem = (key, remove = false) => {
  const item = cachedItems[key] || null;
  if (remove) delete cachedItems[key]
  return item;
}

const setItem = (key, body) => {
  cachedItems[key] = body;
}

const startNgrok = async () => {
  try {
    const url = await ngrok.connect(5555);
    return url;

  } catch (err) {
    console.log(err);
  }
};

const closeNgrok = async () => {
  await ngrok.kill();
};


const requestHook = async ({ request }) => {
  const currentUrl = request.getUrl();
  if (currentUrl.includes('/scraping')) {
    const url = getItem('url');
    const requestId = request.getId();
    const urlWithRequestId = `${url}?requestId=${requestId}`;
    const body = JSON.parse(request.getBody().text);
    request.setBody({ ...request.getBody(), text: JSON.stringify({ ...body, callbackUrl: urlWithRequestId }) });
  }
}

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

const responseHook = async ({ response }) => {
  const statusCode = response.getStatusCode();
  if (statusCode === 200) {
    setItem(`firstResponse${response.getRequestId()}`, response.getBody());
    await setResponseContext(response);
  }
}

const app = express();
app.use(express.json());

let server;

const startServer = () => {
  app.post('/', (req, res) => {
    const result = req.body;
    setItem(`response${result.data.requestId}`, result);

    return res.status(200).json({ success: true });
  })

  server = app.listen(5555, () => console.log('Started! :D'));
}

const closeServer = () => {
  console.log('Closed! :D');
  server.close();
}

module.exports.workspaceActions = [
  {
    label: 'Start callback server',
    icon: 'fa-upload',
    action: async (context, models) => {
      startServer();
      const url = await startNgrok();
      setItem('url', url);
    }
  },
  {
    label: 'Close callback server',
    icon: 'fa-download',
    action: async (context, models) => {
      closeServer();
      closeNgrok();
    }
  }
];

module.exports.requestHooks = [
  requestHook
];

module.exports.responseHooks = [
  responseHook
];
