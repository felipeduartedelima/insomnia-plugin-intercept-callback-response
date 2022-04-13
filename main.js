const { setItem } = require('./cache');
const { startNgrok, closeNgrok } = require('./ngrok');
const { startServer, closeServer } = require('./server');

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
  require('./requestHook')
];

module.exports.responseHooks = [
  require('./responseHook')
];
