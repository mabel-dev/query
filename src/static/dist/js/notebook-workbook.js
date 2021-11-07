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

function addNewStyle(definition) {
    var style = document.createElement('style');
    style.innerHTML = definition;
    document.getElementsByTagName('head')[0].appendChild(style);
}