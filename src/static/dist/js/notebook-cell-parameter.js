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