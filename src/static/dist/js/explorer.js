function initExplorer() {
    document.getElementById("example-query-1").addEventListener("click", function() {
        SqlEditor.setValue(document.getElementById("query1").innerText);
    }, false)
    document.getElementById("example-query-2").addEventListener("click", function() {
        SqlEditor.setValue(document.getElementById("query2").innerText);
    }, false)
}