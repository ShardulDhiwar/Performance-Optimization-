// Save data with expiry
export function setCache(key, data, ttl) {
  const now = new Date();

  const item = {
    data,
    expiry: now.getTime() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

// Get cached data
export function getCache(key) {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  // Check expiry
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.data;
}