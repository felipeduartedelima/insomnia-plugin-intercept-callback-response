const ngrok = require('ngrok');
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

module.exports = { startNgrok, closeNgrok };
