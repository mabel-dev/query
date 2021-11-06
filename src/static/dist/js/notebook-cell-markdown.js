function createNewMarkdownCell(id, cellBlock) {
    cell_icon = '<i class="fab fa-fw fa-markdown notebook-cell-icon"></i>'
    editor_class = 'notebook-cell-editor-markdown'

    cellBlock.insertAdjacentHTML('beforeend', createCell(id, cell_icon, editor_class))

    // add action for the play-function
    document.getElementById(`play-${id}`).addEventListener("click", function() {
        let converter = new showdown.Converter({ tables: 'true' });
        converter.setFlavor('github');
        let markdown = document.getElementById(`editor-${id}`).innerText;

        if (markdown.replace(/(\n|\t|\s)/g, "").length == 0) {
            markdown = "# Empty Text Cell"
        }
        let html = converter.makeHtml(markdown);
        console.log('>' + html + '<');
        document.getElementById(`result-cell-${id}`).innerHTML = html;
        document.getElementById(`notebook-cell-body-${id}`).classList.add("d-none");
        document.getElementById(`result-cell-${id}`).classList.remove("d-none");
    });

    document.getElementById(`result-cell-${id}`).addEventListener("click", function() {
        document.getElementById(`notebook-cell-body-${id}`).classList.remove("d-none");
        document.getElementById(`result-cell-${id}`).classList.add("d-none");
    });

    document.getElementById(`result-cell-${id}`).classList.add("d-none");
    document.getElementById(`result-cell-${id}`).classList.add("result-cell-markdown");
}


// add the new Markdown Cell option
const newMarkdownCellOption = `<li><a class="dropdown-item" href="#" id="new-markdown-cell"><i class="fab fa-fw fa-markdown"></i> Text cell </a></li>`
document.getElementById("notebook-new-cell-selector").insertAdjacentHTML('beforeend', newMarkdownCellOption)
document.getElementById("new-markdown-cell").addEventListener("click", function() { createNewCell("markdown") }, false)