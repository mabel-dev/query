function createNewParameterCell(id, cellBlock) {
    let cell_icon = '<i class="fa-solid fa-fw fa-a notebook-cell-icon"></i>';
    let editor_class = 'notebook-cell-editor-parameter';

    cellBlock.insertAdjacentHTML('beforeend', createCell(id, cell_icon, editor_class))

    let control_bar = document.getElementById(`controls-${id}`)
    control_bar.innerHTML = `
<button id="config-${id}" type="button" class="btn btn-secondary">
    <i class="fa-fw fa-solid fa-gear"></i>
</button>
    ` + control_bar.innerHTML

    // add action for the play-function
    document.getElementById(`play-${id}`);
}


// add the new MArkdown Cell option
const newParameterCellOption = `<li><a class="dropdown-item" href="#" id="new-parameter-cell"><i class="fa-solid fa-fw fa-a"></i> Parameter cell </a></li>`
document.getElementById("notebook-new-cell-selector").insertAdjacentHTML('beforeend', newParameterCellOption)
document.getElementById("new-parameter-cell").addEventListener("click", function() { createNewCell("parameter") }, false)