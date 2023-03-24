const memoryStorage: any = {};

function setItem(key: string, value: string): void {
  try {
    if (sessionStorage) {
      // Safari with privacy options will have sessionStorage
      // but won't let us write to it.
      sessionStorage.setItem(key, value);
    } else {
      // Android WebView might not have sessionStorage at all.
      memoryStorage[key] = value;
    }
  } catch (err) {
    memoryStorage[key] = value;
  }
}

function getItem(key: string): string {
  let value;

  if (sessionStorage) {
    value = sessionStorage.getItem(key) || memoryStorage[key];
  } else {
    value = memoryStorage[key];
  }

  // per sessionStorage spec, it returns null when not found
  return value || null;
}

function removeItem(key: string): void {
  sessionStorage && sessionStorage.removeItem(key);
  delete memoryStorage[key];
}

export const sessionStoragePolyfill = {
  setItem,
  getItem,
  removeItem,
};
