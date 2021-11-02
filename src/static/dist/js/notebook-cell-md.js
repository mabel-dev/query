cell_icon = '<i class="fab fa-fw fa-markdown"></i>'
editor_class = 'notebook-cell-editor-markdown'

document.getElementById("play-md").addEventListener("click", function() {
    var converter = new showdown.Converter();
    var md = document.getElementById("md_editor").innerText;
    document.getElementById("md").innerHTML = converter.makeHtml(md);
})