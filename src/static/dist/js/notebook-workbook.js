/*
A set of helper functions
*/

function putLocalCache(key, value) {
    // put a value in the browser cache
    localStorage.setItem(key, value);
}

function getLocalCache(key) {
    // get a value from the browser cache
    fetched = localStorage.getItem(key)
    if (fetched === undefined) { return "{}" }
    return fetched;
}

function deleteLocalCache(key) {
    // remove a value from the browser cache
    localStorage.removeItem(key);
}

function addNewStyle(definition) {
    // add an ad hoc style to the style sheets
    var style = document.createElement('style');
    style.innerHTML = definition;
    document.getElementsByTagName('head')[0].appendChild(style);
}

function htmlEncode(str) {
    // escape raw text for inclusion in a HTML document
    if (str === undefined || str == null) { return '' }
    return str.toString().replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#' + i.charCodeAt(0) + ';'
        })
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#39;");
}

function getElementsStartsWithId(id) {
    // wildcard search for page elements
    var children = document.body.getElementsByTagName('*');
    var elements = [],
        child;
    for (var i = 0, length = children.length; i < length; i++) {
        child = children[i];
        if (child.id.substr(0, id.length) == id)
            elements.push(child);
    }
    return elements;
}