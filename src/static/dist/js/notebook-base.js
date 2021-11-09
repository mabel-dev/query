var _cellNumber = 0
var _cells = []


function createCell(id, cell_icon, editor_class) {
    /*
    This is a template for notebook cells.
    */
    return `
<div class="notebook-cell" id="cell-${id}">
    <div class="notebook-cell-header">
        <div class="d-flex flex-row justify-content-between">
            <div class="notebook-cell-name align-middle p-2 no-padding">
                ${cell_icon} <span class="notebook-cell-label" id="label-${id}" contenteditable="true" spellcheck="false">Cell_${id}</span>
            </div>
            <div class="p-2 no-padding">
                <button id="changed-${id}" type="button" class="btn btn-sm" disabled>
                    <i class="fa-fw fa-solid fa-asterisk highlight-color"></i>
                </button>
                <div id="controls-${id}" class="btn-group btn-group-sm notebook-cell-buttons" role="group">
                    <button id="delete-cell-${id}" type="button" class="btn btn-danger">
                        <i class="fa-regular fa-fw fa-trash-can"></i>
                    </button>
                </div>
                <button id="play-${id}" type="button" class="btn btn-sm btn-success">
                    <i class="fa-fw fa-solid fa-play"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="card notebook-cell-body" id="notebook-cell-body-${id}">
        <div contenteditable="true" spellcheck="false" class="notebook-cell-editor ${editor_class}" id="editor-${id}"></div>
    </div>

    <div class="notebook-cell-results w-100" id="result-cell-${id}"></div>
</div>
`
}

function createNewCell(type) {
    // Create a new cell
    cellBlock = document.getElementById("cell-block")
    _cellNumber++;
    switch (type) {
        case "sql":
            newCell = createNewSqlCell(_cellNumber, cellBlock);
            break;
        case "parameter":
            newCell = createNewParameterCell(_cellNumber, cellBlock);
            break;
        case "markdown":
            newCell = createNewMarkdownCell(_cellNumber, cellBlock);
            break;
        default:
            break;
    }

    // add default actions to the cell
    document.getElementById(`delete-cell-${_cellNumber}`).addEventListener("click", function(e) {
        removeCell(e.target)
    }, false);

    // ctrl-enter play short-cut
    document.getElementById(`editor-${_cellNumber}`).addEventListener("keydown", function(e) {
        if (!(e.key == "Enter" && (e.metaKey || e.ctrlKey))) { return }
        document.getElementById(`play-${_cellNumber}`).click();
    });

    // keep a record of the cell
    _cells.push({ type: type, id: _cellNumber });
}

function removeCell(element) {

    // we may be at the i tag inside the button
    if (!element.id.startsWith('delete-cell-')) {
        removeCell(element.parentElement);
        return;
    }

    // get the cell id from the button id
    let id = index = element.id.replace(/^delete-cell-/, "");

    // remove the display of a cell - we tombstone the entry in the _cells list
    for (let i = 0; i < _cells.length; i++) {
        if (_cells[i].id == id) {
            _cells[i].deleted = true
        }
    }

    // remove the cell
    let cell = document.getElementById(`cell-${id}`);
    cell.parentElement.removeChild(cell);
}