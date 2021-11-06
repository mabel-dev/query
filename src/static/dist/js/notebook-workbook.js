function putLocalCache(key, value) {
    localStorage.setItem(key, value);
}

function getLocalCache(key) {
    fetched = localStorage.getItem(key)
    if (fetched === undefined) { return "{}" }
    return fetched;
}

function deleteLocalCache(key) {
    localStorage.removeItem(key);
}