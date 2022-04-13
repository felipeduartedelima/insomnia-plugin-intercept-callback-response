const { getItem } = require('./cache')

module.exports = async ({ request }) => {
  const currentUrl = request.getUrl();
  if (currentUrl.includes('/scraping')) {
    const url = getItem('url');
    const requestId = request.getId();
    const urlWithRequestId = `${url}?requestId=${requestId}`;
    const body = JSON.parse(request.getBody().text);
    request.setBody({ ...request.getBody(), text: JSON.stringify({ ...body, callbackUrl: urlWithRequestId }) });
  }
}
