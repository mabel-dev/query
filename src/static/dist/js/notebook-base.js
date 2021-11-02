var _cellNumber = 0


function createCell(id, cell_icon, editor_class) {
    /*
    This is a template for notebook cells.
    */
    return `
<div class="notebook-cell">
    <div class="notebook-cell-header">
        <div class="d-flex flex-row justify-content-between">
            <div class="notebook-cell-name align-middle p-2">
                ${cell_icon} cell ${id}
            </div>
            <div class="p-2">
                <button id="changed-${id}" type="button" class="btn">
                    <i class="fa-fw fa-solid fa-asterisk"></i>
                </button>
                <div class="btn-group btn-group-sm notebook-cell-buttons" role="group">
                    <button id="play-${id}" type="button" class="btn btn-secondary">
                        <i class="fa-fw fa-solid fa-play"></i>
                    </button>
                    <button id="del-${id}" type="button" class="btn btn-secondary">
                        <i class="fa-regular fa-fw fa-trash-can"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="card notebook-cell-body">
        <div contenteditable="true" spellcheck="false" class="notebook-cell-editor ${editor_class}" id="editor-${id}"></div>
    </div>

    <div class="notebook-cell-results" id="result-cell-${id}">

    </div>
</div>
`
}

function createNewCell(type) {
    /*
    Create a new cell
    */
    cellBlock = document.getElementById("cell-block")
    _cellNumber++;
    switch (type) {
        case "sql":
            newCell = createNewSqlCell(_cellNumber, cellBlock);
            break;
        default:
            break;
    }
}

/*
The functions supporting the new cell drop downs
*/
document.getElementById("new-sql-cell").addEventListener("click", function() { createNewCell("sql") }, false)