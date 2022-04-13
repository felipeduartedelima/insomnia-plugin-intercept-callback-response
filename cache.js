const cachedItems = {};

const getItem = (key, remove = false) => {
  const item = cachedItems[key] || null;
  if (remove) delete cachedItems[key]
  return item;
}

const setItem = (key, body) => {
  cachedItems[key] = body;
}


module.exports = { getItem, setItem }
