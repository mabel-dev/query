/*
Everything relating to the operation of Markdown/Text Cells should be in this file and
other than the include in the HTML file, everything should be contained in here.

This converts Markdown to HTML using showdown - it's a relatively simple cell type
and doesn't require a significant amount of code.

This works by switching the visability of the Editor and Results elements when in edit
or display mode.
*/

function createNewMarkdownCell(id, cellBlock) {
    cell_icon = '<i class="fab fa-fw fa-markdown notebook-cell-icon"></i>'
    editor_class = 'notebook-cell-editor-markdown'

    cellBlock.insertAdjacentHTML('beforeend', createCell(id, cell_icon, editor_class))

    // add action for the play-function
    document.getElementById(`play-${id}`).addEventListener("click", function() {
        let converter = new showdown.Converter({ tables: 'true' });
        converter.setFlavor('github');
        let markdown = document.getElementById(`editor-${id}`).innerText;

        // if we have an empty payload - put something in it
        if (markdown.replace(/(\n|\t|\s)/g, "").length == 0) {
            markdown = "# Empty Text Cell"
        }
        let html = converter.makeHtml(markdown);
        document.getElementById(`result-cell-${id}`).innerHTML = html;
        document.getElementById(`notebook-cell-body-${id}`).classList.add("d-none");
        document.getElementById(`result-cell-${id}`).classList.remove("d-none");
    });

    document.getElementById(`result-cell-${id}`).addEventListener("dblclick", function() {
        document.getElementById(`notebook-cell-body-${id}`).classList.remove("d-none");
        document.getElementById(`result-cell-${id}`).classList.add("d-none");
    });

    //    // Enter on the rendered MD returns to the editot
    //    document.getElementById(`result-cell-${id}`).addEventListener("keydown", function() {
    //        if (!(e.key == "Enter")) { return }
    //        document.getElementById(`notebook-cell-body-${id}`).classList.remove("d-none");
    //        document.getElementById(`result-cell-${id}`).classList.add("d-none");
    //    });

    document.getElementById(`result-cell-${id}`).classList.add("d-none");
    document.getElementById(`result-cell-${id}`).classList.add("result-cell-markdown");
}


// add the new Markdown Cell option
const newMarkdownCellOption = `<li><a class="dropdown-item" href="#" id="new-markdown-cell"><i class="fab fa-fw fa-markdown"></i> Text cell </a></li>`
document.getElementById("notebook-new-cell-selector").insertAdjacentHTML('beforeend', newMarkdownCellOption)
document.getElementById("new-markdown-cell").addEventListener("click", function() { createNewCell("markdown") }, false)

// we use an additional class for Markdown - to keep this self-contained we'll
// define it here.
addNewStyle(`
.result-cell-markdown {
    border-top: 1px solid rgba(0, 0, 0, .125);
    border-bottom: 1px solid rgba(0, 0, 0, .125);
    border-radius: 0.25rem;
    padding: 0.6em;
}`)

// we use an additional JS library - showdown, to keep this self-contained, we'll
// import it here.
document.write('<script src="plugins/showdown-1.9.1/js/showdown.min.js"></script>');