function createNewMarkdownCell(id, cellBlock) {
    cell_icon = '<i class="fab fa-fw fa-markdown notebook-cell-icon"></i>'
    editor_class = 'notebook-cell-editor-markdown'

    cellBlock.insertAdjacentHTML('beforeend', createCell(id, cell_icon, editor_class))

    // add action for the play-function
    document.getElementById(`play-${id}`).addEventListener("click", function() {
        var converter = new showdown.Converter({ tables: 'true' });
        var md = document.getElementById(`editor-${id}`).innerText;
        document.getElementById(`result-cell-${id}`).innerHTML = converter.makeHtml(md);
    })
}