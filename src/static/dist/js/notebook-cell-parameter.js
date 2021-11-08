function createNewParameterCell(id, cellBlock) {
    let cell_icon = '<i class="fa-fw icon-parameter notebook-cell-icon"></i>';
    let editor_class = 'notebook-cell-editor-parameter';

    cellBlock.insertAdjacentHTML('beforeend', createCell(id, cell_icon, editor_class))

    // add the cell specific options to the control bar
    document.getElementById(`controls-${id}`).insertAdjacentHTML('beforebegin', `
<div class="btn-group btn-group-sm notebook-cell-buttons" role="group">
    <button id="types-${id}" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="icon-parameter"></i> <span id="type-label-${id}">NOT SET</span> 
    </button>
    <ul class="dropdown-menu" id="notebook-new-cell-selector">
        <li><a href="#" class="dropdown-item" id="parameter-text-${id}"><i class="fa-fw fa-solid fa-a"></i> Text</a></li>
        <li><a href="#" class="dropdown-item" id="parameter-number-${id}"><i class="fa-fw fa-solid fa-1"></i> Number</a></li>
        <li><a href="#" class="dropdown-item" id="parameter-date-${id}"><i class="fa-fw fa-solid fa-calendar-day"></i> Date</a></li>
    </ul>
</div>
    `);

    // add the actions for the type selectors
    document.getElementById(`parameter-text-${id}`).addEventListener("click", function() { set_as_type_text(id); });
    document.getElementById(`parameter-number-${id}`).addEventListener("click", function() { set_as_type_number(id); });
    document.getElementById(`parameter-date-${id}`).addEventListener("click", function() { set_as_type_date(id); });

    // default to a string
    set_as_type_text(id);

}

function set_as_type_text(id) {
    document.getElementById(`type-label-${id}`).innerText = "Text"
    document.getElementById(`notebook-cell-body-${id}`).innerHTML = `
<div class="well-padded">
    <div class="setting-label">TEXT PARAMETER</div>
    <div class="row">
        <label for="editor-${id}" class="col-sm-2 col-form-label">Value</label>
        <div class="col-sm-10">
            <input type="text" class="form-control" id="editor-${id}">
        </div>
    </div>
</div>`
}

function set_as_type_number(id) {
    document.getElementById(`type-label-${id}`).innerText = "Number"
    document.getElementById(`notebook-cell-body-${id}`).innerHTML = `
<div class="well-padded">
    <div class="setting-label">NUMBER PARAMETER</div>
    <div class="row">
        <label for="editor-${id}" class="col-sm-2 col-form-label">Value</label>
        <div class="col-sm-10">
            <input type="number" class="form-control" id="editor-${id}">
        </div>
    </div>
</div>`
}

function set_as_type_date(id) {
    document.getElementById(`type-label-${id}`).innerText = "Date"
    document.getElementById(`notebook-cell-body-${id}`).innerHTML = `
    <div class="well-padded">
    <div class="setting-label">DATE PARAMETER</div>
    <div class="row">
        <label for="editor-${id}" class="col-sm-2 col-form-label">Value</label>
        <div class="col-sm-10">
            <input type="date" class="form-control" id="editor-${id}">
        </div>
    </div>
</div>`
}

// add the new Parameter Cell option
const newParameterCellOption = `<li><a class="dropdown-item" href="#" id="new-parameter-cell"><i class="icon-parameter icon-fw"></i> Parameter cell</a></li>`
document.getElementById("notebook-new-cell-selector").insertAdjacentHTML('beforeend', newParameterCellOption)
document.getElementById("new-parameter-cell").addEventListener("click", function() { createNewCell("parameter") }, false)